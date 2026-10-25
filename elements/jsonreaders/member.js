import fs from 'fs'
import path from 'path';


let MEMBERS={}
const fileMember = path.join(process.cwd(), 'members.json');
if(fs.existsSync(fileMember)){
  MEMBERS=JSON.parse(fs.readFileSync(fileMember,'utf-8'))
  
  
}
function memberQoshish(){
  fs.writeFileSync(fileMember, JSON.stringify(MEMBERS,null,2),'utf-8')
}


export {memberQoshish,MEMBERS}