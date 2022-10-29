const express=require('express');
const db=require('./config/db');
const app=express();
const path=require('path');

// engine 
app.set('views',path.join(__dirname,'/view'));
app.set('view engine', 'ejs');


db();
PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}`);
    
})

app.use(express.json());

app.use('/pwshare/files',require('./routes/up'));
app.use('/files-shared',require('./routes/down'))
app.use('/files-shared/download',require('./routes/downlink'))

// static folder 
app.use(express.static('view'));
app.use(express.static('util'));
