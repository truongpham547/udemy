
const nodemailer = require('nodemailer');


function sendMail(targetEmail,subject,content){
    return new Promise((resolve,reject)=>{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'caohoangtu1357@gmail.com',
                pass: '0961675735'
            }
        });
            
        var mailOptions = {
            from: 'Online Course Team',
            to: targetEmail,
            subject: subject,
            text: content
        };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}

module.exports={
    sendMail:sendMail
}