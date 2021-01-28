const { forwardTo } = require("prisma-binding");

async function user(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function users(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    user,
    users
};