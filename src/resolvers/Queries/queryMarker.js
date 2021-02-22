const { forwardTo } = require("prisma-binding");

const marker = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const markers = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    marker,
    markers
};