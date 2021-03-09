const { forwardTo } = require("prisma-binding");
const { isAllowed } = require("../../utils");

const createEvent = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const updateEvent = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const deleteEvent = async (parent, args, ctx, info) => {
    const event = await ctx.prisma.query.event({ where: { id: args.where.id } }, " { id owner { id } }")
    isAllowed(ctx, event.owner.id);

    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
};