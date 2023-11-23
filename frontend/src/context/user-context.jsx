import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({ user: null });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    if (user) return user;
    try {
      const { data: user } = await axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:5000/user",
      });
      setUser(user);
      return user;
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <UserContext.Provider value={{ user, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
