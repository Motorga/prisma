const { forwardTo } = require("prisma-binding");

const createEvent = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const updateEvent = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const deleteEvent = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
};