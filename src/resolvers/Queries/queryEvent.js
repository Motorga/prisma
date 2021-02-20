const { forwardTo } = require("prisma-binding");

const event = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const events = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    event,
    events
};