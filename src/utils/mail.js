import Mailgen from "mailgen";



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


export {emailVerificationMailContent,forgotPasswordMailContent};
