import fs from "fs"
import path from "path";

let ANIME_CHANNELS = []
const fileChanel = path.join(process.cwd(), "elements", "JSONS", 'Anime_chanels.json');

if (fs.existsSync(fileChanel)) {
    ANIME_CHANNELS = JSON.parse(fs.readFileSync(fileChanel, 'utf-8'))
}

function animechaneladd(nomi,id){
    const obj={
        nomi:nomi,
        id:id
    }
    ANIME_CHANNELS.push(obj)
    amimechanelsaqla()
}




function animechanelochirish(id) {
    try{
        fs.writeFileSync(fileChanel, JSON.stringify(ANIME_CHANNELS.filter(u => u.id !== id), null, 2), 'utf-8')
    }catch(error){
        console.log("error");
    }
}

function amimechanelsaqla(){
    try{
        fs.writeFileSync(fileChanel, JSON.stringify(ANIME_CHANNELS, null, 2), 'utf-8')
    }catch(error){
        console.log("error");
    }
}


export {amimechanelsaqla,animechanelochirish,animechaneladd,ANIME_CHANNELS}