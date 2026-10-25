import { InlineKeyboard } from "grammy";
import { backmenu, bot } from "../../bot.js";
import fs from "fs"
import { delmess, delmessages } from "../funksiyalar/delmess.js";
import path from "path";
import { textliner } from "../foydalanuvchi/Animesearchwithcod.js";

let Animelar = [],animefayl={yana:false}
const fileAnime = path.join(process.cwd(), "elements", "JSONS", 'Animelar.json');
if (fs.existsSync(fileAnime)) {
    Animelar = JSON.parse(fs.readFileSync(fileAnime, 'utf-8'))
}
function animeSaqla() {
    fs.writeFileSync(fileAnime, JSON.stringify(Animelar, null, 2), 'utf-8')
}


export default function () {
    bot.callbackQuery("add_anime", async (ctx) => {
        await ctx.reply("Anime nomi:", { reply_markup: backmenu })
        ctx.session.step = "add_anime_nomi"
    })
    bot.callbackQuery('create_anime', async (ctx) => {
        Animelar.push(
            {
                "kod": Animelar.length + 1,
                "status": "ongoing",
                "nomi": ctx.session.anime_nomi,
                "tags": ctx.session.anime_tags,
                "janrs": ctx.session.anime_janr,
                "titlephoto": ctx.session.anime_photo,
                "titleturi":ctx.session.anime_phototuri,
                "tarif": ctx.session.anime_tavsif,
                "animelar": [],
                "qidirish_soni": 0
            }
        )
        animeSaqla()
        animefayl.yana=true
        await ctx.reply("Anime saqlandi. \n Qismlari soni 0 ", { reply_markup: { inline_keyboard: [[{ text: "Qism qo'shish", callback_data: "add_qism" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
    })
    bot.callbackQuery('ongoing_anime', async (ctx) => {
        delmess(ctx)
        const msg = await ctx.reply("Anime kodini kiriting:", { reply_markup: backmenu })
        ctx.session.step2 = "add_anime_qism"
        ctx.session.step = "add_qism"
        delmessages.set(ctx.chat.id, msg);
    })
    bot.callbackQuery('animedavomi', async (ctx) => {
        delmess(ctx)
        const msg = await ctx.reply("...", { reply_markup: { inline_keyboard: [[{ text: "Animega qism qo'shish", callback_data: "ongoing_anime" }], [{ text: "Anime statusini o'zgatirish", callback_data: "change_anime_status" }], [{ text: "Anime kanal sozlamalari", callback_data: "change_anime_chanel" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
        delmessages.set(ctx.chat.id, msg);
    })
    bot.callbackQuery("add_qism", async (ctx) => {
        await ctx.reply("Video kiriting:", { reply_markup: backmenu })
        ctx.session.step = "add_anime_qism"
        ctx.session.anime_kod = Animelar.length
    })
    
    bot.callbackQuery('change_anime_status', async(ctx)=>{
        delmess(ctx)
        await ctx.reply("Kod kiriting:",{reply_markup:backmenu})
        ctx.session.step="change_anime_status"
        
    })

    bot.on('message:text', async (ctx, next) => {
        const step = ctx.session.step
        try {
            await ctx.editMessageReplyMarkup({
                inline_keyboard: []
            })
        } catch { }
        if (step == "add_anime_nomi") {
            ctx.session.anime_nomi = ctx.message.text
            await ctx.reply("Animeni Header Rasmini yoki Videosini kiriting:", { reply_markup: backmenu })
            ctx.session.step = "add_anime_photo"

        } else if (step == "add_anime_janrs") {
            const janrs = ctx.message.text.split(',')
            for (let i = 0; i < janrs.length; i++) {
                if (!janrs[i].startsWith("#")) {
                    janrs[i] = "#" + janrs[i].trim().replace(" ","_")
                }
            }
            ctx.session.anime_janr = janrs
            await ctx.reply(" Endi taglarni kiriting. Tag bu animeni qidirishda ishlatiladigan qo'shimcha nomlar. Animeni nomini yana qaytib yozish shart emas.\n Har bir tag orasini , bilan ajrating:", { reply_markup: backmenu })
            ctx.session.step = "add_anime_tags"
        } else if (step == "add_anime_tags") {
            ctx.session.anime_tags = [...ctx.message.text.split(","), ctx.session.anime_nomi]
            await ctx.reply("Tavsifni kiriting. Tavsif hajmi maxsimum 500 belgi:", { reply_markup: backmenu })
            ctx.session.step = "Add_anime_tavsif"
        } else if (step == "Add_anime_tavsif") {
            if (ctx.message.text.length <= 500) {
                ctx.session.anime_tavsif = ctx.message.text
                const text = `💾Anime nomi: ${ctx.session.anime_nomi} \n 💻Statusi: Ongoing \n 📚Janr: ${ctx.session.anime_janr.join(",")} \n\n 📃Tarif: \n ${ctx.session.anime_tavsif}`
                if(ctx.session.anime_phototuri=="rasm"){
                    await ctx.replyWithPhoto(ctx.session.anime_photo, { caption: text, reply_markup: { inline_keyboard: [[{ text: "Joylash", callback_data: "create_anime" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
                }else{
                    await ctx.replyWithVideo(ctx.session.anime_photo, { caption: text, reply_markup: { inline_keyboard: [[{ text: "Joylash", callback_data: "create_anime" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
                }

            } else {
                await ctx.reply("❗Juda uzun tavsif boshqa kiriting. Tavsif hajmi maxsimum 500 belgi:", { reply_markup: backmenu })
            }

        } else if (step == "add_qism") {
            delmess(ctx)
            if (!isNaN(parseInt(ctx.message.text))) {
                if (Animelar.find(e => e.kod == parseInt(ctx.message.text))) {
                    ctx.session.anime_kod = parseInt(ctx.message.text)
                    const step2 = ctx.session.step2
                    if (step2 == "add_anime_qism") {
                        textliner(ctx)
                        ctx.session.step = "add_anime_qism"
                        ctx.session.step2 = undefined
                        await ctx.reply("Video kiriting:")
                    }

                } else {
                    await ctx.reply("Kod xoto. Qayta kiriting:", { reply_markup: backmenu })
                }
            } else {
                const msg = await ctx.reply("Id son bo'lishi kerak. Qayta kiriting:", { reply_markup: backmenu })
                delmessages.set(ctx.chat.id, msg);
            }
        }
        else if(step=="change_anime_status"){
            if (!isNaN(parseInt(ctx.message.text))) {
                if (Animelar.find(e => e.kod == parseInt(ctx.message.text))) {
                    ctx.session.anime_kod = parseInt(ctx.message.text)
                    const anime = Animelar.filter(e => e.kod == parseInt(ctx.message.text))[0]
                    const msg = await ctx.reply(`Anime nomi: ${anime.nomi} \n\n Statusi: ${anime.status} \n Statusni o'zgartirish uchun tanlang`, { reply_markup: { inline_keyboard: [[{ text: "Tugallangan", callback_data: "anime_status_Tugallangan" }], [{ text: "Ongoing", callback_data: "anime_status_Ongoing" }], [{ text: "O'chirilgan", callback_data: "anime_status_deleted" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
                    delmessages.set(ctx.chat.id, msg);
                    
                }
            }
        }

        return next()
    })
    bot.on('message:photo', async (ctx, next) => {
        const step = ctx.session.step
        try {
            await ctx.editMessageReplyMarkup({
                inline_keyboard: []
            })
        } catch { }
        if (step == "add_anime_photo") {
            const photoArray = ctx.message.photo;
            const photoId = photoArray[photoArray.length - 1].file_id;
            ctx.session.anime_photo = photoId
            ctx.session.anime_phototuri="rasm"
            await ctx.reply("Rasm qabul qilindi. Endi janrlarni kiriting.\n Har bir janr orasini , bilan ajrating vaboshiga # belgisini qo'ying. Qo'ymasangiz o'zimiz qo'yib qo'yamiz:", { reply_markup: backmenu })
            ctx.session.step = "add_anime_janrs"
        }


        return next()
    })
    bot.on('message:video', async (ctx, next) => {
        const step = ctx.session.step
        try {
            await ctx.editMessageReplyMarkup({
                inline_keyboard: []
            })
        } catch { }
        if (step == "add_anime_qism") {
            delmess(ctx)
            const videoId = ctx.message.video.file_id;
            const anime = Animelar.filter(e => e.kod == ctx.session.anime_kod)[0]

            Animelar.filter(e => e.kod == ctx.session.anime_kod)[0].animelar = [...anime.animelar, videoId]
            animeSaqla()
            textliner(ctx)
            const msg= await ctx.reply("...",{reply_markup:{inline_keyboard:[[{text:"Kanalga Joylash",callback_data:"posttochanel"}],[{text:"Menuga qaytish",callback_data:"check_sub"}]]}})
            delmessages.set(ctx.chat.id, msg);
            await ctx.reply(`Video Qubul qilindi. Video linki: https://t.me/${ctx.me.username}?start=${ctx.session.anime_kod}_${anime.animelar.length}`)
            await ctx.reply("Video kiriting:")
        }else if (step == "add_anime_photo") {
            const photoArray = ctx.message.video.file_id;
            ctx.session.anime_photo = photoArray
            ctx.session.anime_phototuri="video"
            await ctx.reply("Video qabul qilindi. Endi janrlarni kiriting.\n Har bir janr orasini , bilan ajrating vaboshiga # belgisini qo'ying. Qo'ymasangiz o'zimiz qo'yib qo'yamiz:", { reply_markup: backmenu })
            ctx.session.step = "add_anime_janrs"
        }


        return next()
    })

}


export { Animelar, animeSaqla ,animefayl}