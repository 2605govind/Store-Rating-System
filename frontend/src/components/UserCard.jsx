import { useState } from "react";

const UserCard = ({ user, changeRoleMutation, allStores }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const userStore =
        user.role === "store_owner"
            ? allStores?.stores?.find((store) => store.owner_id === user.id)
            : null;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow space-y-2">
            <p className="text-gray-400">ID: {user.id}</p>
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-400">{user.address}</p>

            <p className="text-sm">
                Current Role:{" "}
                <span className="font-medium text-blue-400">{user.role}</span>
            </p>

            {user.role === "store_owner" && (
                <div className="mt-2 bg-gray-700 p-2 rounded">
                    {userStore ? (
                        <>
                            <p className="text-sm text-gray-300">
                                Store: <span className="font-semibold">{userStore.name}</span>
                            </p>
                            <p className="text-sm text-gray-300">
                                Rating:{" "}
                                <span className="font-semibold text-yellow-400">
                                    {userStore.rating}
                                </span>
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-red-400">No Store Assigned</p>
                    )}
                </div>
            )}

            <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            >
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
            </select>

            <button
                onClick={() =>
                    changeRoleMutation({ userId: user.id, role: selectedRole })
                }
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
            >
                Update Role
            </button>
        </div>
    );
};


export default UserCard;