import { bott, bot } from "../../bot.js";

const delmessages = new Map();

// Habarlarni o'chirish function
async function delmess(ctx) {
    try {
        if(delmessages.get(ctx.chat.id)){
            const userId = ctx.chat.id;
            const msg = delmessages.get(userId);
            if (msg && msg.message_id) {
                await ctx.api.deleteMessage(userId, msg.message_id);
                
            }
            delmessages.set(userId,undefined)
        }
    } catch (error) {
        
    }
}

export { delmessages, delmess };
