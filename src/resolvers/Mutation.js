const { createUser, updateUser, deleteUser, inviteMember, deleteMember, updateOpenToUser, resetAllOpen } = require("./Mutations/mutationUser");
const { login, signup, forgotPassword, resetPassword, changePassword } = require("./auth");

const Mutation = {
    createUser, updateUser, deleteUser, inviteMember, deleteMember, updateOpenToUser, resetAllOpen,
    login, signup, forgotPassword, resetPassword, changePassword
};

module.exports = {
    Mutation
};