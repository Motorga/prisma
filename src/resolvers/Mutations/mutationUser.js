const { forwardTo } = require("prisma-binding");

async function createUser(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function updateUser(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function deleteUser(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
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
    users.map(async user => {
        await ctx.prisma.mutation.updateUser({ where: { id: user.id }, data: { open: 0 } })
    })

    return users;
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    updateOpenToUser,
    resetAllOpen
};