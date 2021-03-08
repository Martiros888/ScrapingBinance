import puppeteer from 'puppeteer';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
export const router = express.Router();
export let difference = 10
export let bitcoin = 49000

const bot = new TelegramBot(process.env.TOKEN,{polling:true})


bot.on('text',(msg,match)=>{
    // if (msg.chat.id !== process.env.AMDIN_ID){
    // bot.sendMessage(msg.chat.id,'please go on it isnt for you')
    //}
    if (isNaN(+msg.text)){
        bot.sendMessage(process.env.ADMIN_ID,'please enter number')
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
        bot.sendMessage(process.env.ADMIN_ID,`Bitcoin Value was row and is ${bitcoin}`)
    }
    if (value <= bitcoin - difference) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        bot.sendMessage(process.env.ADMIN_ID,`Bitcoin Value was went and is ${bitcoin}`)
    }
    console.log(value, bitcoin);
}

export const runscript = async ():Promise<any> => {
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