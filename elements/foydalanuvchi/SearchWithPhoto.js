import fetch from "node-fetch";
import { bot } from "../../bot.js";




function formatTime(sec) {
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SearchWithPhoto() {
    bot.callbackQuery("searchwithphoto",async (ctx)=>{
        await ctx.reply("rasm tashlang")
        ctx.session.step="seartwithphoto"
    })
    bot.on("message:photo", async (ctx,next) => {
        if (ctx.session.step == "seartwithphoto") {
            try {
                await ctx.reply("🔍 Rasm qabul qilindi, aniqlash jarayoni boshlandi...");

                // eng katta rasm
                const photos = ctx.message.photo;
                const largest = photos[photos.length - 1];

                const fileId = largest.file_id;

                // telegram rasm linki
                const fileLink = await ctx.api.getFileLink(fileId);

                // trace.moe API’ga so‘rov
                const response = await fetch(
                    "https://api.trace.moe/search?anilistInfo",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                            // agar API token bo‘lsa: 
                            // "x-trace-key": process.env.TRACE_TOKEN
                        },
                        body: JSON.stringify({
                            image: fileLink.href
                        })
                    }
                );

                if (!response.ok) {
                    const text = await response.text();
                    return ctx.reply("❌ Trace.moe xatosi:\n" + text);
                }

                const data = await response.json();

                if (!data.result || data.result.length === 0) {
                    return ctx.reply("❌ Hech qanday anime topilmadi.");
                }

                const result = data.result[0];
                console.log(result);

                const title =
                    result.anilist.title.romaji ||
                    result.anilist.title.english ||
                    result.anilist.title.native ||
                    "Noma’lum anime";

                const episode = result.episode ?? "Noma’lum";
                const similarity = (result.similarity * 100).toFixed(1);
                const atTime = formatTime(result.from);

                const video = result.video;     // mp4 preview (15s)
                const image = result.image;     // screenshot

                const caption = `
<b>${title}</b>

🎬 Episod: <b>${episode}</b>
⏱ Vaqt: <b>${atTime}</b>
🎯 O‘xshashlik: <b>${similarity}%</b>

<a href="https://anilist.co/anime/${result.anilist.id}">AniList profile</a>
    `.trim();

                // video bo‘lsa shuni yuboramiz
                if (video) {
                    return ctx.replyWithVideo(video, {
                        caption,
                        parse_mode: "HTML"
                    });
                }

                // aks holda screenshot
                return ctx.replyWithPhoto(image, {
                    caption,
                    parse_mode: "HTML"
                });
            } catch (error) {
                console.error(error);
                await ctx.reply("⚠️ Xatolik yuz berdi: " + error.message);
            }
        }
        return next()
    });

}