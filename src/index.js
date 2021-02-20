const {GraphQLServer} = require("graphql-yoga");
const {Prisma} = require("prisma-binding");
const resolvers = require("./resolvers");
const { isUserLogged } = require("./utils");
require("dotenv").config();

const isLogged = async (resolve, root, args, context, info) => {
    if (!['token', 'email', 'login', 'signup', 'forgotPassword', 'resetPassword'].includes(info.fieldName) && !isUserLogged(context)) {
        return false;
    }

    const result = await resolve(root, args, context, info);

    return result;
};

const server = new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers,
    context: req => ({
        req,
        prisma: new Prisma({
            typeDefs: "src/generated/prisma.graphql",
            endpoint: process.env.URL_DB_PRISMA,
        }),
    }),
    middlewares: [ isLogged ]
});

server.start(
    {
        cors: {
            origin: process.env.FRONT_URL
        },
        // playground: "dev" === process.env.ENVIRONMENT,
    },
    () => console.log("GraphQL server is running on http://localhost:4000")
);
