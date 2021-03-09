require('dotenv').config();
import puppeteer from 'puppeteer';
import TelegramBot from 'node-telegram-bot-api';
let row = 10
let went = 10
let bitcoin = 49000
let difference = 1
const bot = new TelegramBot(process.env.TOKEN,{polling:true})

bot.on('text',(msg)=>{
    const chatId = msg.chat.id
    console.log(chatId)
    const condition = chatId === +process.env.ADMIN_ID
    if (!condition){
        bot.sendMessage(chatId,'Խնդրում ենք հեռանալ սա ձեր համար չէ')
        return 
    }
    if (isNaN(+msg.text)){
        bot.sendMessage(process.env.ADMIN_ID,'խնդրում ենք թիվ մուտք')
        return  
    }
    difference = +msg.text
    bot.sendMessage(process.env.ADMIN_ID,'ok you changed the difference')
})



const getData = async (page:puppeteer.Page):Promise<any> => { 
    const result = await page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem=> elem === "," ? "" : elem).join("");
    if (value >= bitcoin + difference) {
        console.log(`row with ${difference}`);
        bitcoin = value;
        bot.sendMessage(process.env.ADMIN_ID,`Բիթքոինի գինը աճել է $${difference} և կազմում է $${bitcoin}`)
    }
    if (value <= bitcoin - difference) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        bot.sendMessage(process.env.ADMIN_ID,`Բիթքոինի գինը նվազել է $${difference} և կազմում է $${bitcoin}`)
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