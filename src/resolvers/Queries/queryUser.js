const { forwardTo } = require("prisma-binding");

const user = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const users = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    user,
    users
};