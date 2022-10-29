require('dotenv').config();
const mongoose=require('mongoose');

const url=process.env.MONGODB_CONNECTION_URL;
function db(){
    mongoose.connect(url);
  const connection=mongoose.connection;

  connection.once('open', ()=>{
    console.log("Database Connected Successfully");
  })
}

module.exports=db;