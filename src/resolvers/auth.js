const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");
const { ucFirst, sendMail } = require("../utils");

const signup = async (_, {token, password, lastname, firstname, promotion}, ctx) => {
    const user = await ctx.prisma.query.users({ where: { token: token, status: 'PENDING' } });

    if (!user[0]) {
        throw new Error('Token invalide');
    }

    const bcryptPassword = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.prisma.mutation.updateUser(
        {
            where: {
                email: user[0].email
            },
            data: {
                password: bcryptPassword,
                lastname: ucFirst(lastname),
                firstname: ucFirst(firstname),
                promotion: promotion,
                token: '',
                status: 'ENABLED'
            },
        }
    );

    return generateToken(updatedUser);
}

const login = async (_, {email, password}, ctx) => {
    const user = await ctx.prisma.query.user({ where: { email } });
    
    if (!user || user.status !== 'ENABLED') {
        throw new Error('Identifiants incorrects');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error('Identifiants incorrects');
    }
    
    return generateToken(user);
}

const generateToken = ({ id, email, lastname, firstname, bike, open, promotion, role, status }) => {
    const privateKey = fs.readFileSync("./src/jwt/private.pem");

    return {
        token: jwt.sign({
            id,
            email,
            lastname,
            firstname,
            bike,
            open,
            promotion,
            role,
            status
        }, {
            key: privateKey,
            passphrase: process.env.JWT_PASSPHRASE
        }, {
            algorithm: "RS256",
            expiresIn: "1d"
        })
    };
};

const forgotPassword = async (_, {email}, ctx) => {
    if (!email) {
        throw new Error('Une erreur s\'est produite, veuillez réessayer plus tard');
    }

    const user = await ctx.prisma.query.user({ where: { email: email } });

    if (!user) {
        throw new Error('Cet email n\'existe pas');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const updatedUser = await ctx.prisma.mutation.updateUser({ where: { email: email }, data: { token: token, status: 'DISABLED' } });

    const text = `Bonjour!\nVoici un lien pour changer ton mot de passe:\n${process.env.FRONT_URL}/resetPassword?token=${token}`;

    await sendMail(updatedUser.email, "Mot de passe oublié", text);

    return updatedUser;
}

const resetPassword = async (_, {token, password}, ctx) => {
    if (!token || !password) {
        throw new Error('Une erreur s\'est produite, veuillez réessayer plus tard');
    }

    const user = await ctx.prisma.query.users({ where: { token: token } });

    if (!user[0]) {
        throw new Error('Ce token est invalide');
    }

    const bcryptPassword = await bcrypt.hash(password, 10);
    const updatedUser = await ctx.prisma.mutation.updateUser({ where: { email: user[0].email }, data: { password: bcryptPassword, token: '', status: 'ENABLED' } });

    return updatedUser;
}

const changePassword = async (_, {email, oldPassword, password}, ctx) => {
    if (!email || !oldPassword || !password) {
        throw new Error('Une erreur s\'est produite, veuillez réessayer plus tard');
    }

    const user = await ctx.prisma.query.user({ where: { email: email } });

    if (!user) {
        throw new Error('Cet utilisateur n\'existe pas');
    }

    const valid = await bcrypt.compare(oldPassword, user.password);

    if (!valid) {
        throw new Error('Votre mot de passe actuel est invalide');
    }

    const bcryptPassword = await bcrypt.hash(password, 10);
    const updatedUser = await ctx.prisma.mutation.updateUser({ where: { email: user.email }, data: { password: bcryptPassword } });

    return updatedUser;
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
};
