import fs from 'fs'
import {
    bot
} from '../../bot.js'



let CHANNELS = []
if (fs.existsSync('chanels.json')) {
    CHANNELS = JSON.parse(fs.readFileSync('chanels.json', 'utf-8'))
}






// const app=express()

//Frontend faylni static qilish
// app.use(express.static(path.join(__dirname,"web")))

//mini ilova url i
// const web_url="https://www.figma.com/design/rOvRUuLpYyFLJ1q8OUQIoO/UzChess?t=xo7yIG5WlHqUwp8x-0"

//chanel.json fayli bilan bog'liq amalyotlar va funksiyalar
let natija = 2 //1- muammo yo'q ; 0- linkda xatolik; 2-boshlang'ich natija 
async function chanelqoshish(nomi, linki, turi, soni) { //iki tur bor:ommaviy (oy) va maxviy (my)
    const data = CHANNELS

    let link
    if (linki.includes('@')) {
        link = linki.split('@')
        if (link[0] !== '') {
            natija = 0

        } else {

            natija = 1
        }
    } else if (linki.includes('https://t.me/')) {
        link = linki.split('https://t.me/')
        if (link[0] !== '') {
            natija = 0
        } else {

            natija = 1
        }
    } else {
        natija = 0
    }
    if (natija == 1) {
        if (turi == 'oy') {
            const chan = {
                "name": nomi,
                "link": "https://t.me/" + link[1],
                "username": "@" + link[1],
                "soni": soni
            }
            data.push(chan)
            fs.writeFileSync('chanels.json', JSON.stringify(data, null, 2), 'utf-8')

        } else if (turi == 'my') {
            const chan = {
                "name": nomi,
                "link": "https://t.me/" + link[1],
                "username": null,
                "soni": soni
            }
            data.push(chan)
            fs.writeFileSync('chanels.json', JSON.stringify(data, null, 2), 'utf-8')
        } else if (turi == 'boshqa') {
            const chan = {
                "name": nomi,
                "link": linki,
                "username": "boshqa",
                "soni": soni
            }
            data.push(chan)
            fs.writeFileSync('chanels.json', JSON.stringify(data, null, 2), 'utf-8')
        }

    }

}













// Kanal nomi linki va turini o'zgartirish


//Kanalni o'chirish
function chanelochirish(linki) {
    const data = CHANNELS.filter(u => u.link !== linki)
    console.log(linki + '\n' + data);

    fs.writeFileSync('chanels.json', JSON.stringify(data, null, 2), 'utf-8')
}









export {
    CHANNELS,
    natija,
    chanelochirish,
    chanelqoshish
};