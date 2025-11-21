import { bott,bot } from "../../bot.js"

 const delmessages=new Map()



// habarlarni o'chirish --------------🗑️🗑️🗑️🗑️🗑️🗑️🗑️🚮🚮🚮🚮🚮-----------------------------------------//

    async function delmess(ctx){
        try{
            const userId=ctx.chat.id
            await bot.telegram.deleteMessage(userId,delmessages.get(userId).message_id)
            console.log(`${userId}: ${delmessages.get(userId).message_id} o'chirildi`);
            
        }catch{
            console.log("Xato ");
            
            
        }
    
    }

    
    
        
    
    

export {delmessages,delmess}