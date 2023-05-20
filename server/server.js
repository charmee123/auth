import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');   //less hackers know about our stack


const port = 8080;
 /** http get request */
app.get('/', function(req,res){
    res.status(201).json("Home GET request");
});

/** API routes */
app.use('/api',router);

/** start server only when we have valid connection */
connect().then(()=>{
    try{
        app.listen(port,()=>{
            console.log('Server is listening to port 8080');
        });
    }
    catch(error){
        console.log('Can not connect to the server');
    }
}).catch(error=>{
    console.log("Invalid database connection")
})

