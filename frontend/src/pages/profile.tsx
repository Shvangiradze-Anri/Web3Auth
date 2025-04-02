const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.name || !user.email) {
    return <div>No user data found. Please log in.</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Username:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default Profile;
