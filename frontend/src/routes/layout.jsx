import "../App.css";
import { Outlet } from "react-router-dom";
import BG from "../assets/bg.jpg";
import { UserProvider } from "../context/user-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Layout = () => {
  return (
    <main
      className="text-white min-h-screen flex items-center justify-center bg-no-repeat bg-cover "
      style={{ backgroundImage: `url(${BG})` }}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <UserProvider>
        <Outlet />
      </UserProvider>
    </main>
  );
};
