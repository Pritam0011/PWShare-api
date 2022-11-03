const express=require('express');
const db=require('./config/db');
const cors=require('cors');
const schedule=require('node-schedule');
const app=express();
const path=require('path');

// engine 
app.set('views',path.join(__dirname,'/view'));
app.set('view engine', 'ejs');


db();

const corsOpt={
    origin:process.env.ALLOWED_ORIGINS.split(',')
}
app.use(cors(corsOpt));

PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}`);
    
})

app.use(express.json());

app.use('/pwshare/files',require('./routes/up'));
app.use('/files-shared',require('./routes/down'))
app.use('/files-shared/download',require('./routes/downlink'))

// static folder 
app.use(express.static('view'));


// scheduler
const delData=require('./delScript');
schedule.scheduleJob('0 */4 * * *', ()=>{
    delData();
})
