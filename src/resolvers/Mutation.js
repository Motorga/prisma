const { createUser, updateUser, deleteUser, inviteMember, deleteMember, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { login, signup } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, inviteMember, deleteMember, updateOpenToUser, resetAllOpen,
    login, signup
};

module.exports = {
    Mutation
};