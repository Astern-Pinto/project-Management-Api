import Mailgen from "mailgen";
import nodemailer from "nodemailer";


const emailSender = async (options) =>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product: {
            name:"Project Manager",
            link:"https://project-manager.com"
        }
    });

    const textualemail = mailGenerator.generatePlaintext(options.mailContent)
    const emailHtml = mailGenerator.generate(options.mailContent)


    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    });

    const email = {
        from:"asternp26@gmail.com",
        to: options.email,
        subject: options.subject,
        text: textualemail,
        html: emailHtml
    };


    try {
        await transporter.sendMail(email)
    } catch (error) {
        console.error("❌Error sending email:", error);
    }

}



const emailVerificationMailContent = function(username,emailVerificationUrl){
    return{
        body:{
              name: username,
        intro: 'Welcome to Project Manager! We\'re very excited to have you on board.',
        action: {
            instructions: 'Please click the below button to verify your account',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: emailVerificationUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const forgotPasswordMailContent = function(username,passwwordResetUrl){
    return{
        body:{
              name: username,
        intro: 'we got request to reset the password of your account.',
        action: {
            instructions: 'Please click the below button to reset your password',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: passwwordResetUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}


export {emailVerificationMailContent,forgotPasswordMailContent,emailSender};
