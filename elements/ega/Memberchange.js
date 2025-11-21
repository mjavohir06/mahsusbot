import { Markup } from "telegraf"
import {
    backmenu,
    bot,
} from "../../bot.js"
import {
    delmess,
    delmessages
} from "../funksiyalar/delmess.js"
import {
    MEMBERS
} from "../jsonreaders/member.js"
import fs from "fs"

export default function () {
    
    
    bot.action('member_change', async (ctx) => {
        delmess(ctx)
        let memberlist='Egalar\\=\\=\\=\\=\\>\\\n'
        for(let m in MEMBERS){
            if(MEMBERS[m].turi=="ega"){
                memberlist+=`Username: [${MEMBERS[m].name.replace(".","\\.").replace("_","\\_").replace("*","\\*").replace("-","\\-").replace("`","\\`").replace(">","\\>").replace("#","\\#").replace("+","\\+").replace("~","\\~").replace("=","\\=").replace("|","\\|").replace("{","\\{").replace("}","\\}").replace("!","\\!")}](tg://user?id=${m}), id: *${m}*\n`
            }
        }
        memberlist+="\nAdminlar\\=\\=\\=\\=\\>\n"
        for(let m in MEMBERS){
            if(MEMBERS[m].turi=="admin"){
                memberlist+=`Username: [${MEMBERS[m].name.replace(".","\\.").replace("_","\\_").replace("*","\\*").replace("-","\\-").replace("`","\\`").replace(">","\\>").replace("#","\\#").replace("+","\\+").replace("~","\\~").replace("=","\\=").replace("|","\\|").replace("{","\\{").replace("}","\\}").replace("!","\\!")}](tg://user?id=${m}), id: *${m}*\n`
            }
        }
        const Mlist=JSON.stringify(MEMBERS)
        ctx.reply(memberlist,{parse_mode:'MarkdownV2'})
        fs.writeFileSync('Memberlist.txt',Mlist,'utf-8')
        await ctx.replyWithDocument({source:"Memberlist.txt",filename:"Bot-foydalanuchilari.txt"})

        if(!ctx.session) ctx.session={}
        const msg = await ctx.reply("A'zo idsini kiriting:", Markup.inlineKeyboard(backmenu))
        delmessages.set(ctx.chat.id, msg)
        ctx.session.step="memberid"
    })

    bot.on('text', async (ctx,next) => {
        //Kanal qo'shish 


        console.log(ctx.session);
        if (ctx.session.step=="memberid") {
            
            const id = Number(ctx.message.text)
            delmess(ctx)


            const arr = MEMBERS[id]
            if (arr === undefined) {
                const msg = await ctx.reply("Bu id egasi bot Foydalanuvchisi emas", Markup.inlineKeyboard(
                    backmenu))
                delmessages.set(ctx.chat.id, msg)
            } else {
                const msg = await ctx.reply(
                    `Foydalanuvchi:  ${arr.name} \n Turi :  ${arr.turi} \n \n O'zgartirish:`, Markup
                    .inlineKeyboard([
                        [Markup.button.callback("Ega", `memberch_ega_${id}`)],
                        [Markup.button.callback("Admin", `memberch_admin_${id}`)],
                        [Markup.button.callback("Premium", `memberch_premium_${id}`)],
                        [Markup.button.callback("Foydalanuvchi", `memberch_member_${id}`)], backmenu
                    ]))
                delmessages.set(ctx.chat.id, msg)
                console.log(msg);

            }

        }
        return next()

    })

    bot.on('callback_query', async (ctx,next) => {
        const data = ctx.callbackQuery.data


        if (data.startsWith("memberch_")) {
            delmess(ctx)
            try {
                const d = data.split('memberch_')[1]
                const status = d.split("_")[0]
                const id = d.split("_")[1]
                MEMBERS[id].turi = status
                const w = await bot.telegram.sendMessage(id,
                    `Sizning statusingiz <b>${status.toUpperCase()}</b>ga o'zgartirildi!!!`, {
                        parse_mode: "HTML"
                    })
                console.log(w);

                const msg = await ctx.reply("O'zgartirildi", Markup.inlineKeyboard(backmenu))
                delmessages.set(ctx.chat.id, msg)
            } catch (er) {
                console.log(er);

            }

        }
        return next()
    })
    
}