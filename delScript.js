const File=require('./models/file');
const fs=require('fs');
// const db=require('./config/db')

// db();
// delData();


async function delData(){
    // const ptime=new Date(Date.now()-24*60*60*1000);
    const ptime=new Date(Date.now()-0.5*60*1000);
    const files=await File.find({
        createdAt:{$lt:ptime}
    });
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                console.log('unlinkSync done');
                
                await file.remove();
            }catch(err){
                console.log(err);
            }
        }
    }
    
}


module.exports=delData;