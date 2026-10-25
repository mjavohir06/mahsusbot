import { bot, bot_token } from "../../bot.js";
import { Animelar } from "../admin/Add_anime.js";



export default function () {


    bot.inlineQuery(/.*/, async (ctx, next) => {
        const query = ctx.inlineQuery.query.toLowerCase();
        const animela = await Promise.all(Animelar.map(async a => {
            
            return {
                ...a,
                titlephoto: "https://img.amiami.com/images/product/main/231/GOODS-04314622.jpg"
            }
        }));

        
        const result = animela
            .filter(item => item.tags.join("").toLowerCase().includes(query))
            .map((item, index) => ({
                type: "article",
                id: item.kod,
                title: item.nomi,
                description: item.tarif,
                thumb_url: item.titlephoto, // LISTDA RASM KO‘RINADI
                input_message_content: {
                    message_text:
                        `<a href="${item.titlephoto}">&#8203;</a>` +     // HIDDEN IMAGE PREVIEW
                        `📺 <b>${item.nomi}</b>\n` +
                        `${item.janrs.join("\n")}\n\n` +
                        `<b>Qismlari soni:</b> ${item.status=="Tugallangan" ? `${item.animelar.length} / ${item.animelar.length}` : `${item.animelar.length} / ?`}`+
                        `<pre>${item.tarif}</pre>\n\n` +
                        `🔑 <b>Kod:</b> <code>${item.kod}</code>\n` +
                        `<a href="https://t.me/${ctx.me.username}?start=${item.kod}_0">Tomosha qilish</a>`,
                    parse_mode: "HTML"
                },
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Tomosha qilish",
                                url: `https://t.me/${ctx.me.username}?start=${item.kod}_0`
                            }
                        ]
                    ]
                }
            }));

        await ctx.answerInlineQuery(result);



        return next()
    });


}