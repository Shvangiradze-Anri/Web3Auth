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

  const url = shouldFetch
    ? `http://localhost:5000/users?role=${userRole}`
    : null;

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
        `http://localhost:5000/admin/upgrade/${userId}`,
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
      console.error("Failed to upgrade user", error);
    }
  };

  if (error) {
    return <div>Failed to fetch users</div>;
  }

  return (
    <div className="mt-10">
      <table className="w-full ">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Role</th>
            <th className="px-4 py-2 text-center">Upgrade</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user: User) => (
              <tr key={user._id}>
                <td className="px-4 py-2 text-center">{user._id}</td>
                <td className="px-4 py-2 text-center">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
                <td className="px-4 py-2 text-center">
                  {user.role !== "premium" && (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                      disabled={isLoading ? true : false}
                      onClick={() => upgradeUser(user._id, user.role)}
                    >
                      Upgrade to {user.role === "Admin" ? "Premium" : "Admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
