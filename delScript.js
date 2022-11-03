const File=require('./models/file');
const fs=require('fs');


async function delData(){
    const ptime=new Date(Date.now()-24*60*60*1000);
    const files=await File.find({
        createdAt:{$lt:ptime}
    });
    if(files.length){
        for(const file of files){
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