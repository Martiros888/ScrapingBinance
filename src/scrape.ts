require('dotenv').config();
import puppeteer from 'puppeteer';
import TelegramBot, { BotCommand } from 'node-telegram-bot-api';
let arr = [488557779,999205555,804931910]
let status = 'row'
let row = 10
let went = 10
let bitcoin = 49000
let difference = 100
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
    bot.sendMessage(msg.chat.id,`Բարև ձեզ դուք այս էջի ադմինն եք \nԵթե զանկանում եք փոփոխել գինը խնդրում ենք օգտագործել ներքևի հրամանները և մուտքագրել թվեր ամեն հրամանը սեղմելուց հետո`,options)
})



bot.on('text',(msg)=>{
    const chatId = msg.chat.id
    const condition = chatId === +process.env.ADMIN_ID
    console.log(chatId)
    if (!condition){
        bot.sendMessage(chatId,'Խնդրում ենք հեռանալ սա ձեր համար չէ')
        return 
    }
    if(msg.text === '/start'){
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
        bot.sendMessage(process.env.ADMIN_ID,'խնդրում ենք թիվ մուտքագրել')
        return  
    }
    if(status === 'row'){
        row = +msg.text
        bot.sendMessage(process.env.ADMIN_ID,'դուք փոխեցիք աճի տարբերությունը')
        return 
    }
    bot.sendMessage(process.env.ADMIN_ID,'դուք փոխեցիք նվազման տարբերությունը')
})



const getData = async (page:puppeteer.Page):Promise<any> => { 
    const result = await page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem=> elem === "," ? "" : elem).join("");
    if (value >= bitcoin + row) {
        console.log(`row with ${difference}`);
        bitcoin = value;
        arr.forEach(elem=>{
            bot.sendMessage(elem,`Բիթքոինի գինը աճել է $${row} և կազմում է $${bitcoin}`)
        })
    }
    if (value <= bitcoin - went) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        arr.forEach(elem=>{
            bot.sendMessage(elem,`Բիթքոինի գինը նվազել է $${went} և կազմում է $${bitcoin}`)
        })
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