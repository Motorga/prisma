const { createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { login, signup } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, inviteMember, updateOpenToUser, resetAllOpen,
    login, signup
};

module.exports = {
    Mutation
};