const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

async function signup (_, args, context) {
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.mutation.createUser(
        {
            data: {
                email: args.email,
                password: password,
                lastname: args.lastname,
                firstname: args.firstname,
                promotion: args.promotion
            },
        }
    );

    return generateToken(user);
}

async function login (parent, {email, password}, ctx) {
    const user = await ctx.prisma.query.user({ where: { email } }, "{ id email password lastname firstname promotion role}");
    
    if (!user) {
        throw new Error(`No such user found for email: ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error("Invalid password");
    }

    return generateToken(user);
}

const generateToken = ({id, email, lastname, firstname, promotion, role}) => {
    const privateKey = fs.readFileSync("./src/jwt/private.pem");

    return {
        token: jwt.sign({
            id,
            email,
            lastname,
            firstname,
            promotion,
            role
        }, {
            key: privateKey,
            passphrase: process.env.JWT_PASSPHRASE
        }, {
            algorithm: "RS256",
            expiresIn: "1d"
        })
    };
};

module.exports = {
    signup,
    login
};
