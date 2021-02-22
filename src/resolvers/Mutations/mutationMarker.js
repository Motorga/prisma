const { forwardTo } = require("prisma-binding");

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

const updateMarker = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

const deleteMarker = (parent, args, ctx, info) => {
    return forwardTo("prisma")(parent, args, ctx, info);
}

module.exports = {
    createMarker,
    updateMarker,
    deleteMarker,
};