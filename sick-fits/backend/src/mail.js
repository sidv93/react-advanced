const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const makeEmail = text => `
    <div className="email" styles="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;"
    >
        <h2>Hello there</h2>
        <p>${text}</p>
        <p>Siddharth Venkatesh</p>
    </div>
`;

exports.transport = transport;
exports.makeEmail = makeEmail;