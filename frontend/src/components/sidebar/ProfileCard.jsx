const ProfileCard = ({ userData }) => {
  if (!userData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm ">
      <img
        src={userData.coverImage || ""}
        alt=""
        className="h-20 w-full object-cover"
      />

      <div className="px-4 pb-4">
        <img
          src={userData.profileImage || ""}
          alt=""
          className="w-16 h-16 rounded-full border-4 border-white -mt-8"
        />

        <h3 className="font-semibold text-lg mt-2">
          {(userData.firstName || "") + " " + (userData.lastName || "")}
        </h3>

        <p className="text-sm text-gray-500">{userData.headline || ""}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
