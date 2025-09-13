import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStores, submitRatingRequest, updateRatingRequest } from "../lib/api";
import { useState } from "react";
import { Link } from "react-router";

const UserPage = ({ authUser, handleLogout }) => {
    const queryClient = useQueryClient();
    const [ratings, setRatings] = useState({});

    // API Call
    const { data: allStores = { stores: [] }, isLoading: loadingAllStores, refetch } = useQuery({
        queryKey: ["allStores"],
        queryFn: getAllStores,
        staleTime: 0,
    });

    const { mutate: submitRatingMutation, isPending: isPendingForSubmitRating } = useMutation({
        mutationFn: submitRatingRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allStores"] }),
    });

    const { mutate: updateRatingMutation, isPending: isPendingForUpdateRating } = useMutation({
        mutationFn: updateRatingRequest,
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["allStores"] });
        },
    });

    const handleRatingChange = (storeId, value) => {
        setRatings((prev) => ({ ...prev, [storeId]: value }));
    };

    const handleSendRating = (storeId, isAlreadyRate) => {
        const rating = ratings[storeId];
        if (!rating || rating < 1 || rating > 5) {
            alert("Please enter a rating between 1 and 5");
            return;
        }

        if (isAlreadyRate) {
            updateRatingMutation({ store_id: storeId, rating });
        } else {
            submitRatingMutation({ store_id: storeId, rating });
        }
    };

    if (loadingAllStores || isPendingForSubmitRating || isPendingForUpdateRating) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
                Loading stores...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Navbar */}
            <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
                <div className="font-bold text-lg text-white">Store Rating Platform</div>
                <div className="flex items-center space-x-4 text-sm">
                    <span>{authUser.name}</span>
                    <Link to="/profile" className="hover:underline">Profile</Link>
                    <button
                        className="hover:underline text-red-400"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Store Cards */}
            <div className="p-6 space-y-6">
                {allStores.stores.length === 0 ? (
                    <div className="text-gray-400">No stores available</div>
                ) : (
                    allStores.stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="font-semibold text-xl text-white mb-1">
                                {store.name}
                            </h3>
                            <p className="text-gray-400 mb-3">{store.address}</p>

                            {/* Ratings */}
                            <p className="text-yellow-400 mb-1">
                                ⭐ Overall Rating: {store.overall_rating || 0}
                            </p>
                            <p className="text-green-400 mb-4">
                                ⭐ Your Rating: {store.user_rating || "Not rated"}
                            </p>

                            {/* Rating Input */}
                            <div className="flex space-x-2 items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={ratings[store.id] || ""}
                                    onChange={(e) =>
                                        handleRatingChange(store.id, e.target.value)
                                    }
                                    placeholder="Rate 1-5"
                                    className="border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg p-2 w-28 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <button
                                    onClick={() =>
                                        handleSendRating(store.id, Boolean(store?.user_rating))
                                    }
                                    className="bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                                >
                                    {store?.user_rating ? "Update" : "Send"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserPage;
