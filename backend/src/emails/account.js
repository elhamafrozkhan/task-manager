const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = (email, name) => {
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).catch((e) => {
        console.log('Failed to send welcome email:', e.message);
    });
}

const sendCancelationEmail = (email, name) => {
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back soon.`
    }).catch((e) => {
        console.log('Failed to send cancelation email:', e.message);
    });
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
