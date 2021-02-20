const { user, users } = require("./Queries/queryUser");
const { event, events } = require("./Queries/queryEvent");

const Query = {
    user, users,
    event, events,
};

module.exports = {
    Query
};