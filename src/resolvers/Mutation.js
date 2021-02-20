const { createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { createEvent, updateEvent, deleteEvent } = require("./Mutations/mutationEvent");
const { login, signup, forgotPassword, resetPassword, changePassword } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen,
    createEvent, updateEvent, deleteEvent,
    login, signup, forgotPassword, resetPassword, changePassword
};

module.exports = {
    Mutation
};