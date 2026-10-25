import { backmenu, bot } from "../../bot.js";
import { ANIME_CHANNELS, animechaneladd } from "../jsonreaders/anime_chanel.js";
import { delmess, delmessages } from "./delmess.js";


export default function(){
    bot.callbackQuery('change_anime_chanel', async (ctx) => {
        delmess(ctx)
        let kanallar=""
        for(let ch of ANIME_CHANNELS){
            kanallar+=`Kanal nomi: ${ch.nomi}  Id:${ch.id} \n`
        }

        const msg = await ctx.reply(`Kanallar:\n${kanallar==""?"Kanallar hali mavjud emas":kanallar}\nBu kanallarga Anime bildirishnomalari yuboriladi`, { reply_markup: { inline_keyboard: [[{ text: "Kanal qo'shish qo'shish", callback_data: "Add_anime_chanel" }], [{ text: "Kanal o'chirish", callback_data: "delete_anime_chanel" }], [{ text: "Bekor qilish", callback_data: "check_sub" }]] } })
        delmessages.set(ctx.chat.id, msg);
    })

    bot.callbackQuery("Add_anime_chanel",async (ctx)=>{
        delmess(ctx)
        const msg=await ctx.reply("Kanal nomini kiriting:",{reply_markup:backmenu})
        delmessages.set(ctx.chat.id, msg);
        ctx.session.step="anime_chanel_nomi"
    })

    bot.callbackQuery('delete_anime_chanel',async (ctx)=>{
        delmess(ctx)
    })
    
    
    
    bot.on('message:text',async (ctx,next)=>{
        const step=ctx.session.step
        const text=ctx.message.text
        if(step=="anime_chanel_nomi"){
            delmess(ctx)
            ctx.session.chanel_name=ctx.message.text
            const msg=await ctx.reply("Kanal idsini kiriting:",{reply_markup:backmenu})
            delmessages.set(ctx.chat.id, msg);
            ctx.session.step="aniem_chanel_id"
        }else if(step=="aniem_chanel_id"){
            if(!isNaN(parseInt(text))){
                if(text.startsWith("-100")){
                    animechaneladd(ctx.session.chanel_name,text)
                }else{
                    animechaneladd(ctx.session.chanel_name,"-100"+text)
                }
                const msg=await ctx.reply("Kanal qo'shildi ✅",{reply_markup:backmenu})
                delmessages.set(ctx.chat.id, msg);
            }else{
                const msg=await ctx.reply("Kanal idsi son bo'lishi kerak❗",{reply_markup:backmenu})
                delmessages.set(ctx.chat.id, msg);
            }
            
        }
        

        return next()
    })
}