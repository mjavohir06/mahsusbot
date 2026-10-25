import { chanelsaqla, CHANNELS } from "../jsonreaders/chanel.js";
import { delmessages, delmess } from "./delmess.js";
import { bot, backmenu, userId } from "../../bot.js";
import { memberQoshish, MEMBERS } from "../jsonreaders/member.js";
import fs from "fs";
import { qaytaol, yukla } from "../admin/messagetomembers.js";
import { textliner } from "../foydalanuvchi/Animesearchwithcod.js";

async function obunami(ctx) {
    if (!ctx.session) ctx.session = {};
    let unsubscribed = [];

    for (let ch of CHANNELS) {
        if (ch.username === "telegram") {
            try {
                const member = await ctx.api.getChatMember(ch.id, ctx.from.id);
                if (!['member', 'administrator', 'creator'].includes(member.status)) {
                    unsubscribed.push(ch);
                }
            } catch {
                unsubscribed.push(ch);
            }
        }
    }

    if (unsubscribed.length !== 0 && MEMBERS[ctx.from.id].turi === "member") {
        ctx.session.obunami = false;
        await obunatek(ctx);
        ctx.session.step = undefined;
        ctx.session.nomi = undefined;
    } else {
        ctx.session.obunami = true;
    }
}

async function obunatek(ctx) {
    if (!ctx.session) ctx.session = {};
    yukla();
    await delmess(ctx);
    try {
        await ctx.editMessageReplyMarkup({
            inline_keyboard: []
        })
    } catch { }
    let unsubscribed = [];
    ctx.session.step = undefined;
    ctx.session.nomi = undefined;
    ctx.session.turi = undefined;
    ctx.session.step2 = undefined
    ctx.session.anime_phototuri = undefined
    ctx.session.anime_number = 0


    let ObunaSet;
    if (MEMBERS[ctx.from.id]) {
        ObunaSet = new Set(MEMBERS[ctx.from.id].obunalar);
    }

    for (let ch of CHANNELS) {
        if (ch.username === "telegram") {
            try {
                const member = await ctx.api.getChatMember(ch.id, ctx.from.id);
                if (!['member', 'administrator', 'creator'].includes(member.status) && ch.soni !== 0) {
                    unsubscribed.push(ch);
                    if (ObunaSet?.has(ch.link) && ch.soni > 0) {
                        ch.soni += 1;
                        ObunaSet.delete(ch.link);
                        MEMBERS[ctx.from.id].obunalar = [...ObunaSet];
                    }
                } else {
                    if (ObunaSet && !ObunaSet.has(ch.link) && ch.soni > 0) {
                        ch.soni -= 1;
                        ObunaSet.add(ch.link);
                        MEMBERS[ctx.from.id].obunalar = [...ObunaSet];
                    }
                }
            } catch {
                unsubscribed.push(ch);
            }
        }
    }

    if (unsubscribed.length === 0) {
        ctx.session.obunami = true;
        chanelsaqla();

        const objega = [
            { ega_settings: "Ega sozlamalari" },
        ];
        const objadmin = [
            { admin_settins: "Admin sozlamalari" }
        ];
        const objmember = [
            { search_with_kod: "Kod orqali qidirish", shorts: "Shortlar" },
            { barchaanimelar:"Barcha anime va kinolarni ko'rish", searchwithphoto:"Photo bilan qidirish"}
        ]

        objadmin.push(...objmember)
        objega.push(...objadmin)
        const menu = [];
        if (MEMBERS[ctx.chat.id].turi === "ega") {
            objega.forEach((row) => {
                menu.push(Object.keys(row).map((k) => ({ text: row[k], callback_data: k })));
            });
        } else if (MEMBERS[ctx.chat.id].turi === "admin") {
            objadmin.forEach((row) => {
                menu.push(Object.keys(row).map((k) => ({ text: row[k], callback_data: k })));
            });
        } else {
            objmember.forEach((row) => {
                menu.push(Object.keys(row).map((k) => ({ text: row[k], callback_data: k })));
            });
        }
        menu.push([{text: "Nomi bilan qidirish",switch_inline_query_current_chat: ""}])
        if (ctx.session.aqism) {
            if (ctx.session.aqism == 0) {
                textliner(ctx)
            } else {
                textliner(ctx, ctx.session.aqism)
            }
            ctx.session.aqism = undefined
        } else {

            const msg = await ctx.reply(
                "Botga xush kelibsiz.\nBotdan foydalanish uchun quyidagi tugmalarni tanlang",
                { reply_markup: { inline_keyboard: menu } }
            );
            delmessages.set(ctx.chat.id, msg);
        }
    } else {
        const buttons = unsubscribed.map((ch) => [{ text: ch.name, url: ch.link }]);
        buttons.push([{ text: '✅ Yana tekshirish', callback_data: 'check_sub' }]);

        const msg = await ctx.reply(
            '⚠️ Hali ham quyidagi kanallarga obuna bo‘lishingiz kerak:',
            { reply_markup: { inline_keyboard: buttons } }
        );
        delmessages.set(ctx.chat.id, msg);
    }
}

export default obunatek;
export { obunami };
