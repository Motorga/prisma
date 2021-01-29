const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

async function signup (_, args, ctx) {
    const user = await ctx.prisma.query.users({ where: { token: args.token, status: 'PENDING'} });

    if (!user[0]) {
        throw new Error('Token invalide');
    }

    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.prisma.mutation.updateUser(
        {
            where: {
                email: user[0].email
            },
            data: {
                password: password,
                lastname: args.lastname,
                firstname: args.firstname,
                promotion: args.promotion,
                token: '',
                status: 'ENABLED'
            },
        }
    );

    return generateToken(updatedUser);
}

async function login (parent, {email, password}, ctx) {
    const user = await ctx.prisma.query.user({ where: { email } }, "{ id email password lastname firstname promotion role status}");
    
    if (!user || user.status === 'PENDING') {
        throw new Error('Identifiants incorrects');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error('Invalid password');
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
