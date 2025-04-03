import useSWR from "swr";

import axiosInstance from "../../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const fetchUsers = async (url: string, token: string) => {
  const response = await axiosInstance.get(url, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const AdminDashboard = () => {
  const token = localStorage.getItem("token") as string;
  const userRole = JSON.parse(localStorage.getItem("user") || "{}").role;

  const shouldFetch = token && userRole;

  const url = shouldFetch ? `/users?role=${userRole}` : null;

  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR(
    url,
    (url) => fetchUsers(url, token),
    { revalidateOnFocus: false } // Prevents refetching when the window is focused
  );
  const upgradeUser = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "Admin" ? "Premium" : "Admin";
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `/admin/upgrade/${userId}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        mutate(
          (currentUsers: User[] = []) =>
            currentUsers.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            ),
          false // Prevents unnecessary API calls
        );
      }
    } catch (error) {
      // console.error("Failed to upgrade user", error);
    }
  };

  if (error) {
    return <div>Failed to fetch users</div>;
  }

  return (
    <div className="mt-10 px-6">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#5157c9] text-white">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-center">Upgrade</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user: User, index: number) => (
                <tr
                  key={user._id}
                  className={`border-b border-gray-700 ${
                    index % 2 === 0 ? "bg-[#0d294179]" : "bg-gray-900"
                  } hover:bg-gray-800 transition`}
                >
                  <td className="px-6 py-3 text-white">{user._id}</td>
                  <td className="px-6 py-3 text-white">{user.name}</td>
                  <td className="px-6 py-3 text-white">{user.email}</td>
                  <td className="px-6 py-3 text-white">{user.role}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      disabled={isLoading}
                      onClick={() => upgradeUser(user._id, user.role)}
                    >
                      Upgrade to {user.role === "Admin" ? "Premium" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
