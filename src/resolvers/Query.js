const { user, users } = require("./Queries/queryUser");
const { event, events } = require("./Queries/queryEvent");
const { marker, markers } = require("./Queries/queryMarker");

const Query = {
    user, users,
    event, events,
    marker, markers,
};

module.exports = {
    Query
};