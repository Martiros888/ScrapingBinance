import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import cors from 'cors'
import axios, { AxiosResponse } from 'axios';
import { runscript, router, bitcoin } from './scrape';
const app = express();
const port:string | number = process.env.PORT;



app.use(cors())
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
   extended: false
}))


runscript()






app.listen(port, () => console.log(`server is runnig on port http://localhost:${port}`));


