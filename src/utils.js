require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");

const isUserLogged = (ctx) => {
    const payload = getTokenPayload(ctx);

    if (payload) {
        return true;
    }

    return false;
};

const getTokenPayload = (ctx) => {
    const Authorization = ctx.req.request.get("Authorization");
    if (Authorization && Authorization !== "null") {
        const token = Authorization.replace("Bearer ", "");
        const publicKey = fs.readFileSync("./src/jwt/public.pem");
        return jwt.verify(token, publicKey);
    } else {  
        throw new AuthError();
    }
};

class AuthError extends Error {
    constructor() {
        super("Not authorized");
    }
}

const ucFirst = string => {
    const words = string.split(' ');
    return words.map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}

const sendMail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "ssl0.ovh.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL_USER,
                pass: process.env.SMTP_EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `Contact Motorga <contact@motorga.fr>`,
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        throw Error(error.message);
    }
}

const isAllowed = (ctx, ressourceOwnerId) => {
    const { id, role } = getTokenPayload(ctx);

    if (role !== 'ADMIN' && id !== ressourceOwnerId) {
        throw Error('Unauthorized');
    }
}

module.exports = {
    isUserLogged,
    ucFirst,
    sendMail,
    isAllowed
};
