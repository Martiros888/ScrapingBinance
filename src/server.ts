import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import cors from 'cors'
import puppeteer from 'puppeteer';
import fb from 'firebase-admin';
import { runscript, router } from './scrape';
const app = express();
const port:string | number = process.env.port;



app.use(cors())
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
   extended: false
}))


runscript()

app.use('/test',router)




app.listen(port, () => console.log(`server is runnig on port http://localhost:${port}`));


