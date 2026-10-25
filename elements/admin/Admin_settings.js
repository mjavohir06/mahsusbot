import { bot } from "../../bot.js";
import { delmess, delmessages } from "../funksiyalar/delmess.js";


export default function () {
    const objega = [
        { setting_sub: "📢Majburiy kanal sozlamalari", member_change: "A'zolar Statusini o'zgartirish" },
        {check_sub:"Orqaga Qaytish"}
    ];
    const objadmin = [
        { send_messagetm: "💬Barcha bot a'zolariga habar yuborish", foydalanuvchi_soni: "👥Bot foydalanuvchilari soni" },
        { xabarochir: "A'zolarga yuborilgan habarlarni o'chirish", add_shorts: "Shortlar qo'shish" },
        { add_anime: "Yangi Anime qo'shish", animedavomi: "Onging anime sozlamasi" },
        {check_sub:"Orqaga Qaytish"}
    ];


    
    bot.callbackQuery("admin_settins", async (ctx) => {
        const menu = []
        delmess(ctx)
        objadmin.forEach((row) => {
            menu.push(Object.keys(row).map((k) => ({ text: row[k], callback_data: k })));
        });
        const msg = await ctx.reply(
            "Admin sozlamalari",
            { reply_markup: { inline_keyboard: menu } }
        );
        delmessages.set(ctx.chat.id, msg);
    })
    bot.callbackQuery("ega_settings", async (ctx) => {
        const menu = []
        delmess(ctx)
        objega.forEach((row) => {
            menu.push(Object.keys(row).map((k) => ({ text: row[k], callback_data: k })));
        });
        const msg = await ctx.reply(
            "Ega sozlamalari",
            { reply_markup: { inline_keyboard: menu } }
        );
        delmessages.set(ctx.chat.id, msg);
    })




}
