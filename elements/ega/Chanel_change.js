import {

    bot,
    backmenu
} from "../../bot.js";
import {
    chanelochirish,
    chanelqoshish,
    CHANNELS,
    natija
} from "../jsonreaders/chanel.js";
import {
    delmess,
    delmessages
} from "../funksiyalar/delmess.js";
import {
    Markup
} from "telegraf";
import { obunami } from "../funksiyalar/obunatek.js";

export default function () {


    bot.action('setting_sub', async (ctx) => {
        obunami(ctx)
        let kanal = ''
        for (let ch of CHANNELS) {
            if (ch.username == "boshqa") {
                kanal = kanal + `\n ${ch.name}: ${ch.link} || Boshqa tarmoq`
            } else {

                kanal = kanal + ` ${ch.name}: ${ch.link} || Telegram \n`
            }
        }

        const obj = {
            chanel_plus: "➕ Kanal qo'shish",
            chanel_minus: "➖ Kanal olib tashlansh",
            chanel_soni: "🔢 Kanal obuna sonini o'zgartirish",
            check_sub: "🔙 Bosh menuga qaytish"
        }
        const button = []
        for (let o in obj) {
            button.push([Markup.button.callback(obj[o], o)])
        }
        const msg = await ctx.reply(`Kanallar:\n \n ${kanal} \n Majburiy kanal sozlamalari: `, Markup
            .inlineKeyboard(button))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    });

    //Majburi a'zo kanalini qo'shish
    bot.action('chanel_plus', async (ctx) => {
        obunami(ctx)
        const msg = await ctx.reply("Kanal turini tanlang:", Markup.inlineKeyboard([
            [Markup.button.callback("Ochiq kanal", 'chanel_type_oy')],
            [Markup.button.callback("Yopiq kanal", 'chanel_type_my')],
            [Markup.button.callback("Boshqa", 'chanel_type_boshqa')], backmenu
        ]))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })
    //Majburiy a'zo kanali o'zgartirish
    bot.action('chanel_minus', async (ctx) => {
        obunami(ctx)
        let kanal = ''
        const kanal2 = []
        for (let i = 0; CHANNELS.length > i; i++) {
            let ch = CHANNELS[i]
            if (ch.username == "boshqa") {
                kanal = kanal + `\n ${ch.name}: ${ch.link} || Boshqa tarmoq`
            } else {

                kanal = kanal + ` ${ch.name}: ${ch.link} || Telegram \n`
            }

            kanal2.push([Markup.button.callback(ch.link, `chanel_change_${i}`)])
        }
        kanal2.push(backmenu)
        const msg = await ctx.reply(
            `Kanallar:\n \n ${kanal} \n O'chirilishi kerak bo'lgan kanaldi tanlang: `,
            Markup.inlineKeyboard(kanal2))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })






    // chanel_change
    bot.on('text', async (ctx, next) => {
        let msg2
        if (ctx.session.step == "kanallinki") {
            if (ctx.session.turi) {

                chanelqoshish(ctx.session.nomi, ctx.message.text, ctx.session.turi, 5000)
                let msg
                if (natija === 1) {
                    msg = await ctx.reply("✅ Kanal qo'shildi", Markup.inlineKeyboard([backmenu]))
                } else {
                    msg = await ctx.reply("❌ Kanal linkida muammo bor!!!", Markup.inlineKeyboard([
                        backmenu
                    ]))
                }
                delmess(ctx)
                delmessages.set(ctx.chat.id, msg)
                ctx.session.turi = undefined
            }
            ctx.session.step = undefined
            
        } else if (ctx.session.step == "kanalnomi") {
            ctx.session.nomi = ctx.message.text
            msg2 = await ctx.reply("Kanal linkini kiriting:", Markup.inlineKeyboard([backmenu]))
            ctx.session.step = "kanallinki"
            delmess(ctx)
            delmessages.set(ctx.chat.id, msg2)
            console.log(ctx.session.step);

        }

        return next()
    })
    bot.on('callback_query', async (ctx, next) => {
        const data = ctx.callbackQuery.data
        if (data.startsWith("chanel_type_")) {
            delmess(ctx)
            ctx.session.turi = data.split("chanel_type_")[1]
            const msg = await ctx.reply("Kanal nomini kiriting:", Markup.inlineKeyboard([backmenu]))
            delmessages.set(ctx.chat.id, msg)
            ctx.session.step = "kanalnomi"
            console.log(ctx.session.step);

        }
        if (data.startsWith("chanel_change_")) {
            delmess(ctx)
            const indexlink = parseInt(data.split("chanel_change_")[1])
            chanelochirish(CHANNELS[indexlink].link)
            const msg = await ctx.reply("✅Bot o'chirildi", Markup.inlineKeyboard([backmenu]))
            delmessages.set(ctx.chat.id, msg)
        }
        return next()
    })
}