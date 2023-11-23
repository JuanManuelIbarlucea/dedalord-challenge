const { v4: uuidv4 } = require("uuid");
const users = [
  {
    name: "Test",
    id: 1,
    email: "test@test.com",
    password: "$2b$10$Bc8ceR2NG4U93NMIFR/4CO3s9VuCyiJLS11U99zPBgES5qO.Aa1/y",
  },
  {
    name: "Test2",
    id: 2,
    email: "test2@test.com",
    password: "$2b$10$Bc8ceR2NG4U93NMIFR/4CO3s9VuCyiJLS11U99zPBgES5qO.Aa1/y",
  },
];

exports.getUsers = function () {
  return users;
};

exports.addUser = function (newUser) {
  users.push(newUser);
};

exports.findUserByEmail = (email) => users.find((user) => user.email === email);
exports.findUserById = (id) => users.find((user) => user.id === id);
