import { bot } from "../../bot.js";
import { SHORTS } from "../admin/Addshorts.js";


export default function () {
    bot.callbackQuery('shorts', async (ctx) => {
        if (SHORTS.length > 20) {
            try {
                await ctx.editMessageReplyMarkup({
                    inline_keyboard: []
                })
            } catch { }
            const short = SHORTS[Math.floor(Math.random() * SHORTS.length)]
            await ctx.replyWithVideo(short.id, { caption: short.caption, protect_content: true, reply_markup: { inline_keyboard: [[{ text: "Menu", callback_data: "check_sub" }, { text: "Keyingisi", callback_data: "shorts" }]] } });
        } else {
            
            await ctx.reply("Kechirasiz ammo bizda hozircha yetarlicha shorts yo'q!");
        }

    })
}