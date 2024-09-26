import  express, {Application}  from 'express';
import authRouter from './routes/auth.js';
import cors from 'cors';



const PORT: number = 3000

const app: Application = express();


app.use(cors());

app.use(express.json());

app.use('/', authRouter);//auth router


app.listen(3000, () => {
    console.log('Server started on port 3000');
})