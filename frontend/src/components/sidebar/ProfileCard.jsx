const ProfileCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">

      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        alt=""
        className="h-20 w-full object-cover"
      />

      <div className="px-4 pb-4">

        <img
          src="https://i.pravatar.cc/100"
          alt=""
          className="w-16 h-16 rounded-full border-4 border-white -mt-8"
        />

        <h3 className="font-semibold text-lg mt-2">
          OM Barmaiya
        </h3>

        <p className="text-sm text-gray-500">
          CSE Undergrad | React Developer
        </p>

      </div>
    </div>
  );
};

export default ProfileCard;