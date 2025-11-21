import { Markup } from "telegraf"
import {
   
    bot,
    backmenu
} from "../../bot.js"
import {
    delmess,
    delmessages
} from "../funksiyalar/delmess.js"
import {
    MEMBERS
} from "../jsonreaders/member.js"
import { obunami } from "../funksiyalar/obunatek.js"


//-------------A'zolarga-habar-yuborish-----------//
export default function () {
    bot.action('send_messagetm', async (ctx) => {
        if(!ctx.session) ctx.session={}
        obunami(ctx)
        const msg = await ctx.reply(
            "Barcha a'zoga habar yuborish uchun habar kiriting (Eslatma agar url link kiritish kerak bo'lsa oxirida ||  yordamida chegarlang va [['nomi','url:htttps bilan'],['nomi','url']] kabi yozing):",
            Markup.inlineKeyboard([backmenu]))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
        ctx.session.step="messagetm"
    })

    bot.on('text', async (ctx,next) => {
        if (ctx.message && ctx.session.step=="messagetm") {
            if (ctx.message.text) {
                let text, url = []
                console.log(ctx.message.text);
                let urlbtn = []

                if (ctx.message.text.includes("||")) {
                    const mes = ctx.message.text.split("||")
                    text = mes[0]
                    let tx = mes[1].trim()
                    if (tx.endsWith("]]") && tx.startsWith("[[")) {
                        url = JSON.parse(tx)
                        console.log(url);
                        for (let u of url) {
                            console.log(u);
                            if (u.length == 2 && u[1].startsWith("https://")) {
                                urlbtn.push([Markup.button.url(u[0], u[1])])
                            }
                        }

                    } else {
                        const msg = ctx.reply("❌ Yozishda xatolik bor", Markup.inlineKeyboard(backmenu))
                        delmessages.set(ctx.chat.id, msg)

                    }
                } else {
                    text = ctx.message.text
                }





                for (let member in MEMBERS) {
                    if (urlbtn.length > 0) {
                        bot.telegram.sendMessage(member, text, Markup.inlineKeyboard(urlbtn))

                    } else {
                        bot.telegram.sendMessage(member, text)
                    }
                }
                const msg = ctx.reply("Xabar yuborildi ✅", Markup.inlineKeyboard(backmenu))
                delmessages.set(ctx.chat.id, msg)

            }
        }
        return next()
    })


    bot.on('photo', async (ctx,next) => {
        if (ctx.message && ctx.session.step=="messagetm") {
            let photoid
            const messages = {}
            if (ctx.message.photo) {
                const photol = ctx.message.photo
                console.log(ctx.message.caption);

                photoid = photol[photol.length - 1].file_id

                if (ctx.message.caption) {
                    let text, url = []
                    console.log(ctx.message.caption);

                    if (ctx.message.caption.includes("||")) {
                        const mes = ctx.message.caption.split("||")
                        text = mes[0]
                        let tx = mes[1].trim()
                        if (tx.endsWith("]]") && tx.startsWith("[[")) {
                            url = JSON.parse(tx)
                            console.log(url);
                            let urlbtn = []
                            for (let u of url) {
                                console.log(u);
                                if (u.length == 2 && u[1].startsWith("https://")) {
                                    urlbtn.push([{
                                        text: u[0],
                                        url: u[1]
                                    }])
                                }
                            }
                            console.log(urlbtn);
                            messages.caption = text
                            messages.reply_markup = {
                                inline_keyboard: urlbtn
                            }
                            console.log(messages);


                        } else {
                            const msg = await ctx.reply("❌ Yozishda xatolik bor", Markup.inlineKeyboard(
                                backmenu))
                            delmessages.set(ctx.chat.id, msg)

                        }
                    } else {
                        messages.caption = ctx.message.caption
                    }
                }



            }

            try {
                for (let member in MEMBERS) {
                    bot.telegram.sendPhoto(member, photoid, messages)
                }
                const msg = await ctx.reply("Xabar yuborildi ✅", Markup.inlineKeyboard(backmenu))
                delmessages.set(ctx.chat.id, msg)
            } catch (error) {
                const msg = await ctx.reply("Xabar yuborilmadi ❌", Markup.inlineKeyboard(backmenu))
                delmessages.set(ctx.chat.id, msg)
            }


        }
        return next()
    })

}