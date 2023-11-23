const { v4: uuidv4 } = require("uuid");

const chats = [
  {
    id: 1,
    members: [1, 2],
    messages: [
      { text: "Hello", senderId: 1 },
      { text: "Hello", senderId: 2 },
    ],
  },
];

exports.getChats = function () {
  return chats;
};

exports.createChat = function (members) {
  chats.push({
    id: uuid4(),
    members,
    messages: [],
  });
};

exports.getChat = function (userId, recipientId) {
  return chats.find(
    (chat) =>
      chat.members.includes(userId) && chat.members.includes(recipientId)
  );
};

exports.sendMessage = function (chatId, message) {
  const chat = chats.find((chat) => chat.id === chatId);
  if (!chat) return;
  chat.messages.push(message);
};
