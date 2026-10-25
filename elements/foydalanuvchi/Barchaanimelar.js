import path from "path";
import { bot } from "../../bot.js";
import { animefayl, Animelar } from "../admin/Add_anime.js";
import { delmess } from "../funksiyalar/delmess.js";
import fs from "fs"
import { InputFile } from "grammy";


const filepath = path.join(process.cwd(), "elements", "JSONS", 'Barcha_animelar.txt');
export default function(){
    bot.callbackQuery("barchaanimelar",async (ctx)=>{
        if(animefayl.yana){
            let filetext=""
            for(let a of Animelar){
                filetext+=`Anime nomi: ${a.nomi}\r\nAnime kodi: ${a.kod}\r\nAnime holati: ${a.status}\r\n Hozirdagi anime qismlari soni: ${a.animelar.length}\r\nQidirishlar soni:${a.qidirish_soni} \r\n\r\n`
            }
            fs.writeFileSync(filepath, filetext, 'utf-8')
            animefayl.yana=false
        }
        await ctx.replyWithDocument(new InputFile("./elements/JSONS/Barcha_animelar.txt"))
    })
}