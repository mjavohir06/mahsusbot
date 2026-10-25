import { Bot, session, InlineKeyboard } from "grammy";
import express from "express";


import { MEMBERS, memberQoshish } from "./elements/jsonreaders/member.js";
import obunatek, { obunami } from "./elements/funksiyalar/obunatek.js";


import Chanel_change from "./elements/ega/Chanel_change.js";
import messagetomembers from "./elements/admin/messagetomembers.js";
import Memberchange from "./elements/ega/Memberchange.js";
import Foydalanuchilar_soni from "./elements/admin/Foydalanuchilar_soni.js";
import Habarochir from "./elements/admin/Habarochir.js";
import Messagetochanel from "./elements/funksiyalar/Messagetochanel.js";
import Add_anime from "./elements/admin/Add_anime.js";
import Animesearchwithcod from "./elements/foydalanuvchi/Animesearchwithcod.js";
import Anime_chanel_change from "./elements/funksiyalar/Anime_chanel_change.js";
import Addshorts from "./elements/admin/Addshorts.js";
import Shorts from "./elements/foydalanuvchi/Shorts.js";
import Admin_settings from "./elements/admin/Admin_settings.js";
import Animesearchwithname from "./elements/foydalanuvchi/Animesearchwithname.js";
import Barchaanimelar from "./elements/foydalanuvchi/Barchaanimelar.js";
import SearchWithPhoto from "./elements/foydalanuvchi/SearchWithPhoto.js";

// Bot token va egasi
const bot_token = process.env.BOT_TOKEN;
const ega = 6622110096;

// Grammy botini yaratish
const bot = new Bot(bot_token);
bot.use(session({
    initial: () => ({})
}));
// app.use(express.json());
// app.use(webhookCallback(bot, "express"));
bot.catch(async err => {
    const ctx = err.ctx

    try {
        await bot.api.sendMessage(ega, `------❗Botda Xatolik❗------ \n \n User: ${ctx.from.first_name}, ID:${ctx.from.id} \n\n Error: ${err.error.message}`)
        console.log(err);
        if (ctx.update?.message && ctx.from) {
            try {
                await ctx.reply("Botda nosozlik aniqlandi va bu xaqida bot egasiga xabar berildi! \n Iltimos /start tugmasini qayta bosing.")
            } catch {

            }
        }
    } catch (e) {
        console.log("Ega id xatosi: " + e.message);
    }


})

// Majburiy obuna kanallari
const newMembersMap = new Map(Object.entries(MEMBERS));

// Global o'zgaruvchilar
let userId, bott;
const backmenu = new InlineKeyboard().text("🔙 Bosh menuga qaytish", "check_sub");

// ✅ /start komandasi
bot.command("start", async (ctx) => {
    bott = ctx;
    userId = ctx.from.id;
    const data=ctx.match
    if(data){
        ctx.session.anime_kod=data.split('_')[0]
        ctx.session.aqism=data.split("_")[1]
    }

    if (newMembersMap.has(String(userId))) {
        MEMBERS[userId].name = ctx.from.first_name;
    } else {
        MEMBERS[userId] = {
            name: ctx.from.first_name,
            turi: "member",
            obunalar: [],
        };
    }
    memberQoshish();
    await obunatek(ctx);
});

// ✅ "Tekshirish" tugmasi
bot.callbackQuery("check_sub", async (ctx) => {
    await obunatek(ctx);
    if (!ctx.session) ctx.session = {};
    await ctx.answerCallbackQuery(); // tugma bosilganda xabar berish
});

//-----------------------------------------Majburiy-kanal-a'zoligi---------------------------------------------//
// Majburiy kanal sozlamari faqat bot egasi uchun ishlaydi 
Chanel_change();

// Foydaluvchi statusini o'zgartirish : member, admin, ega
Memberchange();

//-------------A'zolarga xabar yuborish-----------//
Admin_settings()
messagetomembers();
Habarochir();
Foydalanuchilar_soni();

Add_anime()
Animesearchwithcod()
Anime_chanel_change()
Addshorts()
Shorts()
Animesearchwithname()
Barchaanimelar()
SearchWithPhoto()
// Botni ishga tushurish
bot.start({
    drop_pending_updates: true, // pending update'larni o'chirish
});
console.log("✅ Bot ishga tushdi...");
// app.listen(3000, () => {
//   console.log("Bot running on port 3000");
// });

// Export qilish
export { bott, userId, bot, backmenu ,bot_token};
