import { useState } from "react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { updatePassword } from "../lib/api.js";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
    const { authUser } = useAuthUser();
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { mutate: updatePasswordMutate, isPending: isPendingForUpdatePassword } = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success("Password updated successfully", { position: "top-right" });
            setNewPassword("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong", { position: "top-right" });
        },
    });

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!newPassword.trim()) {
            toast.warning("Password cannot be empty", { position: "top-right" });
            return;
        }
        updatePasswordMutate({ newPassword });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
                <div className="font-bold text-lg text-white">
                    <Link to="/" >Store Rating Platform</Link>     
                    
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <Link to="/" className="hover:underline">Home</Link>     
                </div>
            </nav>

            <div className="flex items-center justify-center py-10">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-96 space-y-4">
                    <h2 className="text-2xl font-bold text-center text-white">Profile</h2>

                    <div className="space-y-2">
                        <p><span className="font-semibold text-gray-300">ID: </span>{authUser.id}</p>
                        <p><span className="font-semibold text-gray-300">Name: </span>{authUser.name}</p>
                        <p><span className="font-semibold text-gray-300">Email: </span>{authUser.email}</p>
                        <p><span className="font-semibold text-gray-300">Address: </span>{authUser.address}</p>
                        <p><span className="font-semibold text-gray-300">Role: </span>{authUser.role}</p>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-3">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isPendingForUpdatePassword}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPendingForUpdatePassword ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>

            {isPendingForUpdatePassword && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ProfilePage;
