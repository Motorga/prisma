require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const isUserLogged = (ctx) => {
    const payload = getToken(ctx);

    if (payload) {
        return true;
    }

    return false;
};

const getToken = (ctx) => {
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

module.exports = {
    isUserLogged,
};
