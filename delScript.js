const File=require('./models/file');
const fs=require('fs');
// const db=require('./config/db')

// db();
// delData();


async function delData(){
    const ptime=new Date(Date.now()-24*60*60*1000);
    const file=await File.find({
        createdAt:{$lt:ptime}
    });
    if(file.length){
        for(const file of file){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
            }catch(err){
                console.log(err);
            }
        }
    }
    
}


module.exports=delData;