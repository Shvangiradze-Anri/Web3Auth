const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.name || !user.email) {
    return <div>No user data found. Please log in.</div>;
  }

  return (
    <div className="flex flex-col items-center w-fit text-center shadow-lg p-10  rounded-lg">
      <h1 className=" text-xl text-[#f85959] font-bold shadow-md pb-2 w-fit px-6 ">
        Profile
      </h1>
      <div className="flex flex-col gap-2 mt-10 [&>p]:p-4 [&>p]:bg-[#0d294179] [&>p]:rounded [&>p]:hover:ring-1 [&>p]:hover:ring-[#747bff]">
        <p>
          <strong className="text-[#b14405]">Username:</strong> {user.name}
        </p>
        <p>
          <strong className="text-[#b14405]">Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
