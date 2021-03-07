import puppeteer from 'puppeteer';
import express from 'express';
import admin from 'firebase-admin';
import { MessagingOptions } from 'child_process';
export const router = express.Router();



let difference = 10
let bitcoin = 49000
const getData = async (page:puppeteer.Page):Promise<any> => {
    const result = await page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map((elem) => (elem === "," ? "" : elem)).join("");
    if (value >= bitcoin + difference) {
        console.log(`row with ${difference}`);
        bitcoin = value;
        const payload = {
            data:{
                message: "row",
                bitcoin:String(bitcoin),
            }
        };
        // admin.messaging().sendToDevice(process.env.registrToken,payload).then(res=>console.log(res)).catch(err=>console.log(err))
    }
    if (value <= bitcoin - difference) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        const payload = {
            data:{
                message: "went",
                bitcoin:String(bitcoin),
            }
        };
        // admin.messaging().sendToDevice(process.env.registrToken,payload).then(res=>console.log(res)).catch(err=>console.log(err))
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
            if(num > 5){
                clearInterval(a)
                getData(page)
                run2()
            }
        },1000)
    }
    function run2() {
        let num = 0
        let a = setInterval(async()=>{
            num++
            if(num > 5){
                clearInterval(a)
                getData(page)
                run1()
            }
        },1000)
    }
    run1()
}

router.get('/',async (req, res):Promise<void>=>{
    try{
        const { value } = req.body
        difference = value
        console.log(difference)
        res.send({value:bitcoin})
    } catch(err:any){
        console.log(err)
    }
})

