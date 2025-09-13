import { useQuery } from "@tanstack/react-query";
import { getAverageRating, getUsersWhoRatedStore } from "../lib/api";
import { Link } from "react-router";
import PageLoader from "../components/PageLoader.jsx";

const StoreOwnerPage = ({ authUser, handleLogout }) => {
    const { data: storeData, isLoading: loadingAverageRating } = useQuery({
        queryKey: ["averageRating"],
        queryFn: getAverageRating,
        staleTime: 0,
    });

    const { data: storeRatingsData, isLoading: loadingStoreRatings } = useQuery({
        queryKey: ["storeRatings"],
        queryFn: getUsersWhoRatedStore,
        staleTime: 0,
    });

    if (loadingAverageRating || loadingStoreRatings) {
        return <PageLoader />;
    }

    if (!storeData || !storeData.storeDetails) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
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

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                        <p className="text-xl font-semibold">No Store Found</p>
                        <p className="text-sm">This user has no store assigned.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
                <div className="font-bold text-lg text-white">Store Rating Platform</div>
                <div className="flex items-center space-x-4 text-sm">
                    <span>{authUser.name}</span>
                    <Link to="/profile" className="hover:underline">Profile</Link>
                    <button className="hover:underline text-red-400" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Store Info */}
            <div className="p-6 space-y-4">
                <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow text-white">
                    <h2 className="text-xl font-bold mb-2">{storeData?.storeDetails?.name}</h2>
                    <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {storeData?.storeDetails?.email}
                    </p>
                    <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {storeData?.storeDetails?.address}
                    </p>
                    <p className="mt-2 text-yellow-400">
                        ⭐ Average Rating: {storeData?.averageRating || 0}
                    </p>
                </div>
            </div>

            {/* Users Who Rated */}
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Users Who Rated</h3>
                {storeRatingsData?.users?.length === 0 ? (
                    <div className="text-gray-400">No Ratings Yet</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {storeRatingsData?.users?.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-yellow-400">⭐ {user.rating}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreOwnerPage;
