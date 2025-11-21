import {
    Telegraf,
    Markup,
    session
} from 'telegraf'
// const path=require('path')

const ega = 6622110096 //Bot egasi telegram idsi 

import {
    CHANNELS,
    natija,
    chanelochirish,
    chanelqoshish
} from './elements/jsonreaders/chanel.js'
import {
    MEMBERS,
    memberQoshish
} from './elements/jsonreaders/member.js'
import obunatek, {
    obunami
} from './elements/funksiyalar/obunatek.js'
import {
    delmessages,
    delmess
} from './elements/funksiyalar/delmess.js'

import Chanel_change from './elements/ega/Chanel_change.js'
import messagetomembers from './elements/admin/messagetomembers.js'
import Memberchange from './elements/ega/Memberchange.js'
// chanels.jsondan ma'lumot olish


const bot_token = "8471724009:AAE-9Ke0ViWHx7RlnmT_994479eaqAlJrHY"

const bot = new Telegraf(bot_token)

bot.use(session())



// 🔗 Majburiy obuna kanallari (public yoki private)
const newMembersMap = new Map(Object.entries(MEMBERS))

let userId, bott, backmenu = [Markup.button.callback("🔙 Bosh menuga qaytish", 'check_sub')]

// ✅ /start komandasi
bot.start(async (ctx) => {

    bott = ctx
    userId = ctx.from.id;

    if (newMembersMap.has(String(userId))) {
        MEMBERS[userId].name = ctx.from.first_name

    } else {
        MEMBERS[userId] = {
            name: ctx.from.first_name,
            turi: "member"
        }
    }

    memberQoshish()

    obunatek(ctx)

});

// ✅ "Tekshirish" tugmasi
bot.action('check_sub', async (ctx) => {
    ctx.session.step = undefined
    obunatek(ctx)

});


//-----------------------------------------Majburiy-kanal-a'zoligi---------------------------------------------//

//Majburiy kanal sozlamari faqatgina bot egasi uchun ishlaydi 
Chanel_change()


// Foydaluvchi statusini o'zgartirish :  member, admin, ega
Memberchange()

//-------------A'zolarga-habar-yuborish-----------//
messagetomembers()






















export {
    bott,
    userId,
    bot,
    backmenu
}

bot.launch();
console.log('✅ Bot ishga tushdi...');