import { InlineKeyboard } from "grammy";
import { backmenu, bot } from "../../bot.js";
import { Animelar, animeSaqla } from "../admin/Add_anime.js";
import { delmess, delmessages } from "../funksiyalar/delmess.js";
import { log } from "console";
import Messagetochanel from "../funksiyalar/Messagetochanel.js";


function buttoncollect(ctx, anime, qism) {
    const son = ctx.session.anime_number
    const buttons = new InlineKeyboard()
    let b4
    for (let i = 0; i < 25; i++) {
        if (anime.animelar.length > son * 25 + i) {
            if (qism == i + 1) {
                buttons.text(`[${qism}]`, `animekodi_${anime.kod}_${qism}`);
            } else {
                buttons.text(`${i + 1 + son * 25}`, `animekodi_${anime.kod}_${i + 1 + son * 25}`);
            }

            if ((i + 1) % 5 === 0) {
                buttons.row(); // har 5 tadan keyin qator
                b4 = false
            } else {
                b4 = true
            }
        }
    }

    if (b4) {
        buttons.row()
    }
    buttons.text("🔙", "minus_number").text("❌", "check_sub").text("🔜", "plus_number")

    return buttons
}
async function textliner(ctx,qism) {
    
    
    const kod =ctx.session.anime_kod
    const anime = Animelar.filter(e => e.kod == parseInt(kod))[0]
    Animelar.filter(e => e.kod == parseInt(kod))[0].qidirish_soni=anime.qidirish_soni+1
    animeSaqla()
    delmess(ctx)
    if(!anime){
        const msg = await ctx.reply("Anime mavjud emas", { reply_markup: backmenu })
        delmessages.set(ctx.chat.id, msg);
        return;
    }
    if (anime.status == "deleted") {
        const msg = await ctx.reply("Anime o'chirilgan.\nIltimos boshqa kod kiriting", { reply_markup: backmenu })
        delmessages.set(ctx.chat.id, msg);
    } else {
        let text,buttons
        
        if(qism){
            text = `<b>${anime.nomi}</b>  \n \n ${qism}-qism`
            buttons = await buttoncollect(ctx, anime,qism)
            await ctx.replyWithVideo(anime.animelar[qism-1], { caption: text,protect_content:true, parse_mode: 'HTML', reply_markup: buttons })
        }else{
            text = `<b>💾Anime nomi:</b> ${anime.nomi} \n <b>💻Statusi:</b> ${anime.status} \n <b> Qismilari: ${anime.status=="Tugallangan"? `${anime.animelar.length}/${anime.animelar.length}`:`${anime.animelar.length}/?`}</b> \n <b>📚Janr:</b> ${anime.janrs.join(",")} \n\n  <pre> ${anime.tarif} </pre> \n <b>Qidirishlar soni</b>: ${anime.qidirish_soni}`
            buttons = await buttoncollect(ctx, anime)
            if(anime.titleturi=="rasm"){
                try{
                    await ctx.replyWithPhoto(anime.titlephoto, { caption: text, parse_mode: 'HTML', reply_markup: buttons })
                   
                }
                catch(err){
                    console.log(err);
                    
                }
            }else{
                try{
                    const msg = await ctx.replyWithVideo(anime.titlephoto, { caption: text, parse_mode: 'HTML', reply_markup: buttons })
                    delmessages.set(ctx.chat.id, msg);
                }catch(err){
                    console.log(err);
                    
                }
            }
            
        }

    }
}


export default function () {
    bot.callbackQuery('search_with_kod', async (ctx) => {
        delmess(ctx)
        ctx.replyWith
        const msg = await ctx.reply("Anime kodini kiriting:", { reply_markup: backmenu })
        ctx.session.step2 = "search_with_kod"
        delmessages.set(ctx.chat.id, msg);
        ctx.session.anime_number = 0
    })

    bot.callbackQuery("minus_number", async (ctx) => {
        const kod = ctx.session.anime_kod
        const anime = Animelar.filter(e => e.kod == kod)[0]
        if (ctx.session.anime_number != 0) {
            ctx.session.anime_number = ctx.session.anime_number - 1
            buttoncollect(ctx, anime)
            textliner(ctx)
        }
    })

    bot.callbackQuery("plus_number", async (ctx) => {
        const kod = ctx.session.anime_kod
        const anime = Animelar.filter(e => e.kod == kod)[0]
        if (anime.animelar.length > (ctx.session.anime_number+1) * 25) {
            ctx.session.anime_number = ctx.session.anime_number + 1
            buttoncollect(ctx, anime)
            textliner(ctx)
        }

    })
    bot.callbackQuery('posttochanel',async (ctx)=>{
        const kod = ctx.session.anime_kod
        const anime = Animelar.filter(e => e.kod == parseInt(kod))[0]
        if(anime.status=="Tugallangan"){
            Messagetochanel(anime,ctx,0)
        }else{
            Messagetochanel(anime,ctx,anime.animelar.length)
        }
    })

    bot.on('callback_query:data', async (ctx, next) => {
        const calldata = ctx.callbackQuery.data
        if (calldata.startsWith('animekodi_')) {
            try {
                await ctx.editMessageReplyMarkup({
                    inline_keyboard: []
                })
            } catch { }
            const data = calldata.split('animekodi_')[1]
            const kod = parseInt(data.split("_")[0])
            ctx.session.anime_kod = kod
            const qism = parseInt(data.split("_")[1])
            
            const anime = Animelar.filter(e => e.kod == kod)[0]
            
            textliner(ctx,qism)
        } else if (calldata.startsWith("anime_status_")) {
            delmess(ctx)
            const data = calldata.split("anime_status_")[1]
            const kod = ctx.session.anime_kod
            Animelar.filter(e => e.kod == kod)[0].status = data
            
            animeSaqla()
            const msg = await ctx.reply("O'zgartirish qabul qilindi", { reply_markup: {inline_keyboard:[[{text:"Kanalga yuklash",callback_data:"posttochanel"}],[{text:"Menuga qaytish",callback_data:"check_sub"}]]} })
            delmessages.set(ctx.chat.id, msg);
            
        }

        return next()
    })
    bot.on('message:text', async (ctx, next) => {
        const data = ctx.message.text
        if (ctx.session.step == undefined || ctx.session.step2 == "search_with_kod") {
            if (!isNaN(parseInt(data))) {
                if (Animelar.find(e => e.kod == parseInt(data))) {
                    ctx.session.anime_kod = data
                    
                    
                    textliner(ctx)
                }
            }
        }

        return next()
    })

}
export {textliner}