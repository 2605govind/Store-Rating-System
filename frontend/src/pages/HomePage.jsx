import { useMutation, useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import UserPage from "../components/UserPage.jsx";
import useLogout from "../hooks/useLogout.js";
import StoreOwnerPage from "../components/StoreOwnerPage.jsx";
import AdminPage from "../components/AdminPage.jsx";

const HomePage = () => {
    const { authUser  } = useAuthUser();
    const { logoutMutation } = useLogout();

    function handleLogout() {
        logoutMutation();
    }
    
    return (
        <div className="bg-gray-800 min-h-screen text-white">
            {authUser.role === "admin" && <AdminPage authUser={authUser} handleLogout={handleLogout}/>}
            {authUser.role === "store_owner" && <StoreOwnerPage authUser={authUser} handleLogout={handleLogout} />}
            {authUser.role === "user" && <UserPage authUser={authUser} handleLogout={handleLogout} />}
            {!authUser.role && <p className="text-center mt-10">Loading...</p>}
        </div>
    )
}
export default HomePage;