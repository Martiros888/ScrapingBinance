require('dotenv').config();
import puppeteer from 'puppeteer';
import TelegramBot, { BotCommand } from 'node-telegram-bot-api';
type user = {
    id:number
    password?:string
}
let arr:user[] = []
let status = 'row'
let row = 10
let went = 10
let bitcoin = 49000
const bot:TelegramBot = new TelegramBot(process.env.TOKEN,{polling:true})


bot.setMyCommands([{command:'start',description:'start'}])

bot.onText(/^\/start$/,msg=>{
    const user = arr.find(elem=> elem.id === msg.chat.id)
    if(user){
        bot.sendMessage(msg.chat.id,'Դուք արդեն գրանցված եք')
        return 
    }
    const options:TelegramBot.SendMessageOptions = {
        parse_mode: "MarkdownV2",
        reply_markup: {
            keyboard: [
                [{ text:'փոխել նվազելու արժեքը'}],
                [{ text:"փոխել աճելու արժեքը" }]
          ]
        }
    };
    arr = [...arr,{id:msg.chat.id}]
    bot.sendMessage(msg.chat.id,"Բարև ձեզ խնդրում ենք մուտքագրել կոդը",options)
})



bot.on('text',async msg=>{
    const chatId = msg.chat.id
    if(msg.text === '/start'){
        return 
    }
    const user = arr.find(elem=>elem.id === msg.chat.id)
    if(!user){
        bot.sendMessage(chatId,'խնդրում ենք սեղմել /start սկսելու համար')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if(!user.password){
        if(msg.text === process.env.PASSWORD){
            arr = arr.map(elem=> {
                elem.password = msg.text
                return elem
            })
            bot.sendMessage(chatId,'ճիշտ է')
            .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
            return 
        }
        bot.sendMessage(chatId,'գրեք նորից')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if(msg.text === 'փոխել նվազելու արժեքը'){
        status = 'went'
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if(msg.text === 'փոխել աճելու արժեքը'){
        status = 'row'
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if (isNaN(+msg.text)){
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return  
    }
    if(status === 'row'){
        bot.sendMessage(chatId,'դուք փոխեցիք աճի տարբերությունը')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        row = +msg.text
        return 
    }
    bot.sendMessage(chatId,'դուք փոխեցիք նվազման տարբերությունը')
    .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
    went = +msg.text
})



// const getData = async (page:puppeteer.Page):Promise<any> => { 
//     const result = await page.evaluate(() => {
//         let element = document.getElementsByClassName("css-10nf7hq");
//         return element[53].innerHTML;
//     });
//     let value = ~~+result.slice(1).split("").map(elem=> elem === "," ? "" : elem).join("");
//     if (value >= bitcoin + row) {
//         arr.forEach(async user=>{
//             if(user.password){
//                 bot.sendMessage(user.id,`Բիթքոինի գինը աճել է $${~~(value-bitcoin)} և կազմում է $${value}`)
//                 .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== user.id))
//             }
//         })
//         bitcoin = value;
//     }
//     if (value <= bitcoin - went) {
//         arr.forEach(async user=>{
//             if(user.password){
//                 bot.sendMessage(user.id,`Բիթքոինի գինը նվազել է $${~~(bitcoin-value)} և կազմում է $${value}`)
//                 .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== user.id))
//             }
//         })
//         bitcoin = value;
//     }
//     console.log(value, bitcoin);
// }

// const runscript = async ():Promise<any> => {
//     const browser = await puppeteer.launch({
//         args: [
//         '--disable-gpu',
//         '--disable-dev-shm-usage',
//         '--disable-setuid-sandbox',
//         '--no-first-run',
//         '--no-sandbox',
//         '--no-zygote',
//         '--single-process',
//     ]});
//     const page = await browser.newPage();
//     await page.goto(process.env.API);
//     function run1() {
//         let num = 0
//         let a = setInterval(async()=>{
//             num++
//             if(num > 1){
//                 clearInterval(a)
//                 getData(page)
//                 run2()
//             }
//         },5000)
//     }
//     function run2() {
//         let num = 0
//         let a = setInterval(async()=>{
//             num++
//             if(num > 1){
//                 clearInterval(a)
//                 getData(page)
//                 run1()
//             }
//         },5000)
//     }
//     run1()
// }


// runscript()

