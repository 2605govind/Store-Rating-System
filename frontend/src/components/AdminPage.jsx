import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addStore, addUser, addAdmin, getAdminDashboard, changeRole, getAllUsers, getAllStoresForAdmin } from "../lib/api";
import { Link } from "react-router";
import { toast } from "react-toastify";
import PageLoader from "./PageLoader";
import { useState } from "react";
import Form from '../components/Form.jsx'
import UserCard from '../components/UserCard.jsx'

const AdminPage = ({ authUser, handleLogout }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    owner_id: "",
  });

  // API
  const { data: adminDashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    staleTime: 0,
  });

  const { data: allStores = { stores: [] }, isLoading: loadingAllStores } =
    useQuery({
      queryKey: ["allStores"],
      queryFn: getAllStoresForAdmin,
      staleTime: 0,
    });

  const { data: allUsers = { users: [] }, isLoading: loadingUsers, } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    staleTime: 0,
  });


  const { mutate: addStoreMutation, isPending: addingStore, error: errorAtAddStore } = useMutation({
    mutationFn: addStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStores"] });
      toast.success("Store added successfully");
      resetForm();
    }
  });

  const { mutate: addUserMutation, isPending: addingUser, error: errorAtAddUser } = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success("User added successfully");
      resetForm();
    }
  });

  const { mutate: addAdminMutation, isPending: addingAdmin, error: errorAtAddAdmin } = useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success("Admin added successfully");
      resetForm();
    }
  });

  const { mutate: changeRoleMutation, isPending: changingRole, error: errorAtChangeRole } = useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success("Role updated successfully");
    }
  });




  const resetForm = () => setFormData({ name: "", email: "", password: "", address: "", owner_id: "" });

  if (
    loadingDashboard ||
    loadingUsers ||
    addingStore ||
    addingUser ||
    addingAdmin ||
    changingRole ||
    loadingAllStores
  ) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
        <div className="font-bold text-lg text-white">Store Rating Admin Dashboard</div>
        <div className="flex items-center space-x-4 text-sm">
          <span>{authUser?.name}</span>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <button
            className="hover:underline text-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-white">Total Ratings</h3>
          <p className="text-2xl font-bold text-blue-400">
            {adminDashboard?.totalRatings ?? 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-white">Total Stores</h3>
          <p className="text-2xl font-bold text-green-400">
            {adminDashboard?.totalStores ?? 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-white">Total Users</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {adminDashboard?.totalUsers ?? 0}
          </p>
        </div>
      </div>


      <div className="p-6">
        <div className="flex space-x-6 border-b border-gray-700 mb-6 flex-wrap">
          {["users", "stores", "addUser", "addAdmin", "addStore"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400"
                }`}
            >
              {tab === "users" && "All Users"}
              {tab === "stores" && "All Stores"}
              {tab === "addUser" && "Add User"}
              {tab === "addAdmin" && "Add Admin"}
              {tab === "addStore" && "Add Store"}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              className="mb-4 px-3 py-2 rounded bg-gray-800 text-white w-full sm:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex space-x-4 mb-4">
              {["all", "user", "store_owner", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-3 py-1 rounded-full text-sm ${activeRole === role
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {role === "all"
                    ? "All"
                    : role === "user"
                      ? "User"
                      : role === "store_owner"
                        ? "Store Owner"
                        : "Admin"}
                </button>
              ))}
            </div>

            {allUsers?.users?.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.users
                  .filter((u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .filter((u) =>
                    activeRole === "all" ? true : u.role === activeRole
                  )
                  .map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      changeRoleMutation={changeRoleMutation}
                      allStores={allStores} 
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            {allStores?.stores?.length === 0 ? (
              <p>No stores found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allStores.stores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-gray-800 p-4 rounded-lg shadow space-y-2"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {store.name}
                    </h3>
                    <p className="text-gray-400">{store.email}</p>
                    <p className="text-gray-400">{store.address}</p>
                    <p className="text-sm">
                      Rating:{" "}
                      <span className="font-medium text-yellow-400">
                        {store.rating}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addUser" && (
          <Form
            title="Add User"
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => addUserMutation(formData)}
            error={errorAtAddUser}
          />
        )}

        {activeTab === "addAdmin" && (
          <Form
            title="Add Admin"
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => addAdminMutation(formData)}
            error={errorAtAddAdmin}
          />
        )}

        {activeTab === "addStore" && (
          <Form
            title="Add Store"
            formData={formData}
            setFormData={setFormData}
            onSubmit={() =>
              addStoreMutation({
                name: formData.name,
                email: formData.email,
                address: formData.address,
                owner_id: formData.owner_id,
              })
            }
            isStore
            error={errorAtAddStore}
          />
        )}
      </div>
    </div>
  );
};


export default AdminPage;
