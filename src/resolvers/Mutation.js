const { createUser, updateUser, deleteUser, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { login, signup } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, updateOpenToUser, resetAllOpen,
    login, signup
};

module.exports = {
    Mutation
};