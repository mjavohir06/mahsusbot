import {
    CHANNELS
} from "../jsonreaders/chanel.js";
import  {
    delmessages,
    delmess
} from "./delmess.js";
import {
    userId,
    bot
} from "../../bot.js";
import {
    Telegraf,
    Markup
} from 'telegraf'
import {
    MEMBERS
} from "../jsonreaders/member.js";
import fs from "fs"

async function chanelid(username) {

    try {
        const chat = await bot.telegram.getChat(username);
        return chat.id
    } catch (err) {
        return "error"
    }
}

async function obunami(ctx) {
    if(!ctx.session) ctx.session={}
    let unsubscribed = []
    
    for (let ch of CHANNELS) {
        if (ch.username) {
            if (ch.username !== "boshqa") {
                try {
                    const member = await ctx.telegram.getChatMember(ch.username, ctx.from.id);
                    if (!['member', 'administrator', 'creator'].includes(member.status)) {
                        unsubscribed.push(ch);
                    }
                } catch {
                    unsubscribed.push(ch);
                }
            } 
        } else {
            if (ch.username !== "boshqa") {
                const id = await chanelid(ch.link.split("@")[1])
                try {
                    let member = await ctx.telegram.getChatMember(id, ctx.from.id);

                } catch (err) {
                    unsubscribed.push(ch)
                }
            }
        }
    }
    if(unsubscribed.length!==0){
        if(MEMBERS[ctx.from.id].turi!=="member"){
        }else{
            ctx.session.obunami=false
            obunatek(ctx)
            ctx.session.step=undefined
            ctx.session.nomi=undefined            

        }
    }else{
        
        
        ctx.session.obunami=true
    }
}


async function obunatek(ctx) {
    if(!ctx.session) ctx.session={}
    let unsubscribed = []
    ctx.session.step=undefined
    ctx.session.nomi=undefined  
    for (let ch of CHANNELS) {
        if (ch.username) {
            if (ch.username !== "boshqa") {
                try {
                    const member = await ctx.telegram.getChatMember(ch.username, ctx.from.id);
                    if (!['member', 'administrator', 'creator'].includes(member.status)) {
                        unsubscribed.push(ch);
                    }
                } catch {
                    unsubscribed.push(ch);
                }
            } 
        } else {
            if (ch.username !== "boshqa") {
                const id = await chanelid(ch.link.split("@")[1])
                try {
                    let member = await ctx.telegram.getChatMember(id, ctx.from.id);

                } catch (err) {
                    unsubscribed.push(ch)
                }
            }
        }
    }
    if(unsubscribed.length>0){
        for (let ch of CHANNELS) {
            if(ch.username=="boshqa"){
                unsubscribed.push(ch)
            }
        }
        
    }
    if(MEMBERS[ctx.from.id].turi!=="member"){
        
        
        unsubscribed=[]
    }

    if (unsubscribed.length === 0) {
        ctx.session.obunami=true
        //Asosiy menu tugmasini nomilari va buyruqlari
        
        const objega = {
            setting_sub: "📢Majburiy kanal sozlamalari",
            member_change:"A'zolar Statusini o'zgartirish",
            send_messagetm: "💬Barcha bot a'zolariga habar yuborish"
        }
        const objadmin={
            send_messagetm: "💬Barcha bot a'zolariga habar yuborish"
        }
        const menu = []

        if (MEMBERS[ctx.chat.id].turi == "ega") {
            for (let o in objega) {
                menu.push([Markup.button.callback(objega[o], o)])

            }


        }else if (MEMBERS[ctx.chat.id].turi == "admin") {
            for (let o in objadmin) {
                menu.push([Markup.button.callback(objadmin[o], o)])

            }


        }

        const msg = await ctx.reply("Botga xush  kelibsiz.\n Botdan foydalanish uchun quyidagi tugmalarni tanlang",
            Markup.inlineKeyboard(menu));
        delmess(ctx)
        delmessages.set(ctx.chat.id,msg)

        // fs.writeFileSync('file.txt',"salomlar423 \n \thello",'utf-8')
        // await ctx.replyWithDocument({source:"file.txt",filename:"file.txt"})
            

    } else {
        const buttons = unsubscribed.map((ch) => [Markup.button.url(ch.name, ch.link)]);

        buttons.push([Markup.button.callback('✅ Yana tekshirish', 'check_sub')]);


        const msg = await ctx.reply(
            '⚠️ Hali ham quyidagi kanallarga obuna bo‘lishingiz kerak:',
            Markup.inlineKeyboard(buttons)
        );
        delmess(ctx)
        delmessages.set(ctx.chat.id,msg)
    }
}


export default obunatek
export {obunami}