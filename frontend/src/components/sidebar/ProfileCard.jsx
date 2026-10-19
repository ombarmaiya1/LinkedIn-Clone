const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const ProfileCard = ({ userData }) => {
  if (!userData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {userData.coverImage ? (
        <img
          src={userData.coverImage}
          alt="cover"
          className="h-20 w-full object-cover"
        />
      ) : (
        <div className="h-20 w-full bg-gradient-to-r from-blue-600 to-sky-500" />
      )}

      <div className="px-4 pb-4">
        <img
          src={userData.profileImage || DEFAULT_AVATAR}
          alt="profile"
          className="w-16 h-16 rounded-full border-4 border-white -mt-8 object-cover bg-white"
        />

        <h3 className="font-semibold text-lg mt-2 truncate">
          {((userData.firstName || "") + " " + (userData.lastName || "")).trim() || "User"}
        </h3>

        <p className="text-sm text-gray-500 truncate">{userData.headline || "No headline"}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
