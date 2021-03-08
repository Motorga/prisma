const { forwardTo } = require("prisma-binding");
const { isAllowed } = require("../../utils");

const createMarker = async (parent, args, ctx, info) => {
    const { user: { connect: { id } } } = args.data;

    if (id) {
        const markers = await ctx.prisma.query.markers({ where: { user: { id: id } } }, "{ id }");

        markers.forEach(async marker => {
            await ctx.prisma.mutation.deleteMarker({ where: { id: marker.id } }, "{ id }");
        })
    }

    return forwardTo("prisma")(parent, args, ctx, info);
}

const updateMarker = async (parent, args, ctx, info) => {
    const marker = await ctx.prisma.query.marker({ where: { id: args.where.id } }, " { id user { id } }")
    isAllowed(ctx, marker.user.id);

    return forwardTo("prisma")(parent, args, ctx, info);
}

const deleteMarker = async (parent, args, ctx, info) => {
    const marker = await ctx.prisma.query.marker({ where: { id: args.where.id } }, " { id user { id } }")
    isAllowed(ctx, marker.user.id);

    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    createMarker,
    updateMarker,
    deleteMarker,
};