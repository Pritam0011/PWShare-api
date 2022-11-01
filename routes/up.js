const router=require('express').Router();
const path=require('path');
const multer=require('multer');
const {v4:uuid4}=require('uuid');
const File=require('../models/file')



let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req, file, cb)=>{
        const uniqeName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqeName);
    }
})

let upload=multer({
    storage,
    limit:{fileSize:157286400},
}).single('myfile');

router.post('/',(req,res)=>{

    //uploading
    upload(req,res,async(err)=>{
        if(!req.file){
            return res.json({error:"All fields are needed!"});
        }
        
        if(err){
            return res.status(500).send({error:err.message})
        }
        // store into database 
        const file=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        })

        const response=await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files-shared/${response.uuid}`});

    });

});

router.post('/link-send',async(req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body;
    if(!uuid||!emailTo||!emailFrom){
        return res.status(422).send({error:'All fields are required.'});
    }

    const file=await File.findOne({uuid:uuid});
    if(file.receiver==emailTo){
        return res.status(422).send({error:'Already send once!'});
    }
    file.sender=emailFrom;
    file.receiver=emailTo;

    const response=await file.save();

    // email send 
    const send=require('../config/emailSer');
    send({
        from:emailFrom,
        to:emailTo,
        subject:`PWShare - File Shared`,
        text:`${emailFrom} shared a file...`,
        html:require('../config/emailTemp')({
            emailFrom:emailFrom,
            dnl:`${process.env.APP_BASE_URL}/files-shared/${file.uuid}`,
            size:parseInt(file.size/1024)+` KB`,
            exp:`24 Hours`
        }),
    });
    return res.send({success:"Email Send Successfully."})

});


module.exports= router;