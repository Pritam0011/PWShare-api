const nodemailer=require('nodemailer');

async function send({from,to,subject,text,html}){
        let trans=nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

    let info=await trans.sendMail({
        from:`PWShare <${from}>`,
        to:to,
        subject:subject,
        text:text,
        html:html,
    })

}


module.exports=send;