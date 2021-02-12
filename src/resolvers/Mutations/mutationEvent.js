const { forwardTo } = require("prisma-binding");

async function createEvent(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function updateEvent(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

async function deleteEvent(parent, args, ctx, info) {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
};