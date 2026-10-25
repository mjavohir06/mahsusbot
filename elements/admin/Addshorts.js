import path from "path";
import { backmenu, bot } from "../../bot.js";
import { delmess, delmessages } from "../funksiyalar/delmess.js";
import fs from "fs"

let SHORTS = []
const fileShorts = path.join(process.cwd(), "elements", "JSONS", 'Shorts.json');
if (fs.existsSync(fileShorts)) {
    SHORTS = JSON.parse(fs.readFileSync(fileShorts, 'utf-8'))
}

function Addshort(id, text) {
    const obj = {
        id: id,
        caption: text
    }
    SHORTS.push(obj)
    shortsaqla()
}
function shortsaqla() {
    try {
        fs.writeFileSync(fileShorts, JSON.stringify(SHORTS, null, 2), 'utf-8')
    } catch (error) {
        console.log("error");
    }
}



export default function () {
    bot.callbackQuery("add_shorts", async (ctx) => {
        delmess(ctx)
        const msg = await ctx.reply(`Short Video kiriting. Hozirda mavjud shortlar soni: ${SHORTS.length} ta`, { reply_markup: backmenu });
        delmessages.set(ctx.chat.id, msg);
        ctx.session.step="add_shorts"
    })

    bot.on('message:video', async (ctx, next) => {
        if(ctx.session.step=="add_shorts"){
            try {
                await ctx.editMessageReplyMarkup({
                    inline_keyboard: []
                })
            } catch { }
            const video = ctx.message.video.file_id
            let text = "@" + ctx.me.username
            Addshort(video, text)
            await ctx.reply(`Xohlasangiz yana Short Video kiriting`, { reply_markup: backmenu });
        }

        return next()
    })
}

export {SHORTS}