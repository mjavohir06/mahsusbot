import { bot } from "../../bot.js"
import { ANIME_CHANNELS } from "../jsonreaders/anime_chanel.js"
import { delmess } from "./delmess.js"


export default async function (anime,ctx,qism) {
    if (Array.isArray(ANIME_CHANNELS)) {
        delmess(ctx)
        for (let ch of ANIME_CHANNELS) {
            if (ch.id) {
                try {
                    let text
                    if(qism==0){
                        text=`<b>💾Anime nomi:</b> ${anime.nomi} \n <b>💻Statusi:</b> ${anime.status} \n <b> Qismilari: ${anime.status=="Tugallangan"? `${anime.animelar.length}/${anime.animelar.length}`:`${anime.animelar.length}/?`}</b> \n <b>📚Janr:</b> ${anime.janrs.join(",")} \n@${ctx.me.username}`
                    }else{
                        text=`<b>${anime.nomi} \n\n ${qism}-qism\n\n@${ctx.me.username}`
                    }
                    if(anime.titleturi=="rasm"){
                        bot.api.sendPhoto(ch.id,anime.titlephoto,{caption:text,parse_mode:'HTML',reply_markup:{inline_keyboard:[[{text:"Tomosha qilish",url:`https://t.me/${ctx.me.username}?start=${anime.kod}_${qism}`}]]}})
                    }
                    else{
                        bot.api.sendVideo(ch.id,anime.titlephoto,{caption:text,parse_mode:'HTML',reply_markup:{inline_keyboard:[[{text:"Tomosha qilish",url:`https://t.me/${ctx.me.username}?start=${anime.kod}_${qism}`}]]}})
                    }
                    await ctx.reply(`${ch.nomi}ga yuborildi`)
                } catch {
                    await ctx.reply(`${ch.nomi}ga yuborilmadi. Bot admin bo'lmasligi mumkin.`)
                }
            }

        }
    }

}