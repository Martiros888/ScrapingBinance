import { runscript } from './scrape';
import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import cors from 'cors'
const app = express();
const port:string | number = process.env.PORT ?? 8888;




app.use(cors())
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
   extended: false
}))

app.get('/',async (req, res):Promise<void>=>{
    try{
        res.send('ok')
    } catch(err:any){
        console.log(err)
    }
})
runscript()


app.listen(port, () => console.log(`server is runnig on port ${port}`));