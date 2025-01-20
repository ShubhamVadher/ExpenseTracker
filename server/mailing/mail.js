const nodemailer=require('nodemailer');
const crypto=require('crypto')
const pass=process.env.MAIL_PASSWORD
const mailer_id=process.env.MAILER_ID
const otpgen=()=>{
    const otp=crypto.randomInt(100000,999999);
    return otp;
}

const mail=async(otp,email)=>{
    const mailerdata=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:mailer_id,
            pass:pass
        }
    })
    const info=await mailerdata.sendMail({
        from:mailer_id,
        to:email,
        subject:'OTP for expenss tracker',
        text:`OTP is ${otp}\nPlease do not share the otp with anyone`
    })
}

const otp=async(email)=>{
    const otp=otpgen();
    await mail(otp,email);
    return otp;

}
module.exports={otp};