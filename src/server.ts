import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import cors from 'cors'
import { runscript } from './scrape';
const app = express();
const port:string | number = process.env.PORT ?? 8080;




app.use(cors())
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
   extended: false
}))


app.get('/',(req,res)=>{
    res.send('hello')
})
runscript()


app.listen(port, () => console.log(`server is runnig on port `));