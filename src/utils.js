require("dotenv").config();
const jwt = require("jsonwebtoken");

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
        return jwt.verify(token);
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
