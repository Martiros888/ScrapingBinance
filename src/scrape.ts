require('dotenv').config();
import puppeteer from 'puppeteer';
import TelegramBot, { BotCommand } from 'node-telegram-bot-api';
import bcrypt from 'bcrypt';
let arr = []
let status = 'row'
let row = 10
let went = 10
let bitcoin = 49000
const bot = new TelegramBot(process.env.TOKEN,{polling:true})


bot.onText(/^\/start$/,msg=>{
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
    const condition = chatId === +process.env.ADMIN_ID
    const user = arr.find(elem=>elem.id === msg.chat.id)
    if(!user.password){
        const isTrue = await bcrypt.compare(msg.text,process.env.PASSWORD)
        if(isTrue){
            arr = arr.map(elem=> {
                elem.password = msg.text
                return elem
            })
            bot.sendMessage(chatId,'ճիշտ է')
            return 
        }
        bot.sendMessage(chatId,'գրեք նորից')
        return 
    }
    if(msg.text === 'փոխել նվազելու արժեքը'){
        status = 'went'
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար')
        return 
    }
    if(msg.text === 'փոխել աճելու արժեքը'){
        status = 'row'
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար')
        return 
    }
    if (isNaN(+msg.text)){
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել')
        return  
    }
    if(status === 'row'){
        row = +msg.text
        bot.sendMessage(chatId,'դուք փոխեցիք աճի տարբերությունը')
        return 
    }
    went = +msg.text
    bot.sendMessage(chatId,'դուք փոխեցիք նվազման տարբերությունը')
})



const getData = async (page:puppeteer.Page):Promise<any> => { 
    const result = await page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem=> elem === "," ? "" : elem).join("");
    if (value >= bitcoin + row) {
        console.log(`row with ${row}`);
        bitcoin = value;
        arr.forEach(elem=> elem.password ? bot.sendMessage(elem.id,`Բիթքոինի գինը աճել է $${row} և կազմում է $${bitcoin}`): null)
    }
    if (value <= bitcoin - went) {
        console.log(`went down with ${went}`);
        bitcoin = value;
        arr.forEach(elem=> elem.password ? bot.sendMessage(elem.id,`Բիթքոինի գինը նվազել է $${went} և կազմում է $${bitcoin}`) : null)
    }
    console.log(value, bitcoin);
}

const runscript = async ():Promise<any> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.API);
    function run1() {
        let num = 0
        let a = setInterval(async()=>{
            num++
            if(num > 1){
                clearInterval(a)
                getData(page)
                run2()
            }
        },5000)
    }
    function run2() {
        let num = 0
        let a = setInterval(async()=>{
            num++
            if(num > 1){
                clearInterval(a)
                getData(page)
                run1()
            }
        },5000)
    }
    run1()
}


runscript()


