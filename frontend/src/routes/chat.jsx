import React, { useEffect, useState } from "react";
import { useUser } from "../context/user-context";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatRecipient } from "../components/chat-recipient";
import { IoMdSend } from "react-icons/io";

export const Chat = () => {
  const { getUser } = useUser();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState("");

  const findUser = async () => {
    const user = await getUser();
    if (!user) {
      navigate("/login");
    }
    setUser(user);
  };

  const getUsers = async () => {
    try {
      const { data } = await axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:5000/users",
      });
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    findUser();
    getUsers();
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    if (user) {
      socket.emit("addNewUser", user.id, user.name);
    }
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?.id !== res.chatId) return;
      setCurrentChat((prev) => {
        return { ...prev, messages: [...prev.messages, res] };
      });
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

  const sendMessage = (event) => {
    event.preventDefault();
    const recipientId = currentChat?.members.find((id) => id !== user?.id);
    const message = {
      chatId: currentChat.id,
      text: messageText,
      senderId: user.id,
    };
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/message",
      data: message,
    }).then(() => {
      socket?.emit("sendMessage", message);
      setCurrentChat((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
    });

    setMessageText("");
  };

  const getCurrentChat = async (recipientId, name) => {
    try {
      const { data: chat } = await axios({
        method: "GET",
        withCredentials: true,
        url: `http://localhost:5000/chat?recipientId=${recipientId}`,
      });
      setCurrentChat({ ...chat, recipient: name });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <div className="bg-black h-[60rem] w-[60rem] border-2 rounded-2xl border-white flex">
        <div className="bg-white h-full min-w-[15rem] rounded-l-2xl overflow-auto">
          <div className=" bg-black p-2 text-center text-2xl">
            Online Users:
            {
              onlineUsers.filter((onlineUser) => onlineUser.userId !== user.id)
                .length
            }
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto">
            {users
              .filter((chatUser) => chatUser.id !== user.id)
              .map((chatUser) => {
                const isOnline = onlineUsers.some(
                  (onlineUser) => onlineUser.userId === chatUser.id
                );
                return (
                  <ChatRecipient
                    getChat={getCurrentChat}
                    key={chatUser.id}
                    user={chatUser}
                    isOnline={isOnline}
                  />
                );
              })}
          </div>
        </div>
        <div className="bg-red-500 grow rounded-r-2xl border-4 border-gray-500">
          {!currentChat ? (
            <div className="h-full flex justify-center items-center">
              No chat yet
            </div>
          ) : (
            <div className="flex flex-col h-full text-black">
              <div className="sticky bg-white text-black text-2xl text-center p-2 ">
                {currentChat.recipient}
              </div>
              <div className="grid auto-rows-min grow w-full gap-2 p-5 overflow-auto">
                {currentChat.messages.map((message) => (
                  <div
                    className={`max-w-[50%] rounded-2xl  p-3 ${
                      message.senderId === user.id
                        ? "justify-self-end  bg-green-200"
                        : "justify-self-start bg-blue-200"
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <form
                onSubmit={sendMessage}
                className="flex w-full gap-5 h-15 p-2"
              >
                <input
                  className="grow p-2"
                  onChange={(ev) => setMessageText(ev.target.value)}
                  value={messageText}
                  type="text"
                />
                <button
                  onClick={() => sendMessage}
                  type="submit"
                  className=" bg-green-600 w-10 h-10 flex justify-center items-center rounded-md p-2"
                >
                  <IoMdSend />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
