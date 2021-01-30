const { forwardTo } = require("prisma-binding");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function createUser(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function updateUser(parent, args, ctx, info) {
    if (args.data.password) {
        args.data.password = await bcrypt.hash(args.data.password, 10);
    }

    return forwardTo("prisma")(parent, args, ctx, info);
}

async function deleteUser(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function inviteMember(parent, args, ctx, info) {
    const regexEMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regexEMail.test(String(args.email).toLowerCase())) {
        throw new Error('Email invalide');
    }

    const foundUser = await ctx.prisma.query.user({ where: { email: args.email } }, "{ id email }");

    if (foundUser) {
        throw new Error('Cet email est déjà utilisé pour un autre membre');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const user = await ctx.prisma.mutation.createUser({ data: { email: args.email, token: token } }, "{ id email }");

    return user;
}

async function updateOpenToUser(parent, args, ctx, info) {
    if (args.open < 0) {
        throw new Error(`Impossible de descendre en dessous de 0 points OPEN`);
    }

    const user = await ctx.prisma.query.user({ where: { id: args.id } }, "{ id open role}");

    if (!user) {
        throw new Error(`Cet utilisateur n'existe pas`);
    }

    if (user.role === 'USER' && args.open > 4) {
        throw new Error(`Un membre ne peut pas avoir plus de 4 points OPEN`);
    }

    if (user.role === 'ADMIN' && args.open > 8) {
        throw new Error(`Un admin ne peut pas avoir plus de 8 points OPEN`);
    }

    return await ctx.prisma.mutation.updateUser({ where: { id: args.id }, data: { open: args.open } }, "{ id open }");
}

async function resetAllOpen(parent, args, ctx, info) {
    const users = await ctx.prisma.query.users({}, "{ id open }");

    //using map because foreach doesn't work for the type of response from graphql
    await Promise.all(users.map(async user => {
        await ctx.prisma.mutation.updateUser({ where: { id: user.id }, data: { open: 0 } })
    }));

    const newUsers = await ctx.prisma.query.users({}, "{ id open }");

    return newUsers;
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    inviteMember,
    updateOpenToUser,
    resetAllOpen
};