const { createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { createEvent, updateEvent, deleteEvent } = require("./Mutations/mutationEvent");
const { createMarker, updateMarker, deleteMarker } = require("./Mutations/mutationMarker");
const { login, signup, forgotPassword, resetPassword, changePassword } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen,
    createEvent, updateEvent, deleteEvent,
    createMarker, updateMarker, deleteMarker,
    login, signup, forgotPassword, resetPassword, changePassword
};

module.exports = {
    Mutation
};