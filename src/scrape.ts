require('dotenv').config();
import puppeteer from 'puppeteer';
import TelegramBot from 'node-telegram-bot-api';
import { user } from './Types';
const bot:TelegramBot = new TelegramBot(process.env.TOKEN,{polling:true})
const interval = 1000
let arr:user[] = []
let bitcoin = 60000

const options:TelegramBot.SendMessageOptions = {
    parse_mode: "MarkdownV2",
    reply_markup: {
        keyboard: [
            [{ text:`փոխել նվազելու արժեքը`}],
            [{ text:`փոխել աճելու արժեքը` }]
        ]
    }
}

bot.setMyCommands([{command:'start',description:'start'}])

bot.onText(/^\/start$/,msg=>{
    const chatId = msg.chat.id
    const user = arr.find(elem=> elem.id === chatId)
    if(user){
        bot.sendMessage(chatId,'Դուք արդեն գրանցված եք')
        return 
    }
    arr = [...arr,{id:chatId,bitcoin,row:0,went:0}]
    bot.sendMessage(chatId,"Բարև ձեզ խնդրում ենք մուտքագրել կոդը",options)
})



bot.on('text',async msg=>{
    const chatId = msg.chat.id
    if(msg.text === '/start'){
        return 
    }
    const user = arr.find(elem=>elem.id === chatId)
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
        arr = arr.map(elem => {
            if(elem.id === chatId){
                elem.status = 'went'
            }
            return elem
        })  
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if(msg.text === 'փոխել աճելու արժեքը'){
        arr = arr.map(elem => {
            if(elem.id === chatId){
                elem.status = 'row'
            }
            return elem
        })
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return 
    }
    if (isNaN(+msg.text)){
        bot.sendMessage(chatId,'խնդրում ենք թիվ մուտքագրել')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        return  
    }
    if(!user.status){
        bot.sendMessage(chatId,'դուք չեք նշել ինչն եք ուզում փոխել')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
    }
    if(user.status === 'row'){
        bot.sendMessage(chatId,'դուք փոխեցիք աճի տարբերությունը')
        .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
        arr = arr.map(elem=>{
            if(elem.id === chatId){
                elem.row = +msg.text
            }
            return elem
        })
        return 
    }
    bot.sendMessage(chatId,'դուք փոխեցիք նվազման տարբերությունը')
    .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== chatId))
    arr = arr.map(elem=>{
        if(elem.id === chatId){
            elem.went = +msg.text
        }
        return elem
    })
})



const getData = async (page:puppeteer.Page):Promise<any> => { 
    const result = await page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = ~~+result.slice(1).split("").map(elem=> elem === "," ? "" : elem).join("");
    console.log(value)
        arr.map(user=>{
            console.log(user,value)
            if(user.password){
                if (value >= user.bitcoin + user.row) {
                    bot.sendMessage(user.id,`Բիթքոինի գինը աճել է $${~~(value - user.bitcoin)} և կազմում է $${value}`)
                    .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== user.id))
                    user.bitcoin = value;
                }
                if (value <= user.bitcoin - user.went) {
                    bot.sendMessage(user.id,`Բիթքոինի գինը նվազել է $${~~(user.bitcoin - value)} և կազմում է $${value}`)
                    .then(res=>null).catch(err=> arr = arr.filter(elem=> elem.id !== user.id))
                    user.bitcoin = value;
                }
            }
            bitcoin = value
            return user
        })
}

export const runscript = async ():Promise<any> => {
    const browser = await puppeteer.launch({
        args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
    ]});
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
        },interval)
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
        },interval)
    }
    run1()
}




