const ProfileDropdown = () => {
  return (
    <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

      <div className="p-4">
        <div className="flex gap-3">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-14 h-14 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-lg">OM Barmaiya</h3>
            <p className="text-sm text-gray-600">
              CSE Undergrad | Learning Java, Python & ML
            </p>
          </div>
        </div>

        <button className="w-full mt-4 border border-blue-600 text-blue-600 rounded-full py-2 hover:bg-blue-50">
          View Profile
        </button>
      </div>

      <hr />

      <div className="p-4">
        <h4 className="font-semibold mb-2">Account</h4>

        <div className="space-y-2 text-gray-600">
          <p>Claim Premium free trial</p>
          <p>Settings & Privacy</p>
          <p>Help</p>
          <p>Language</p>
        </div>
      </div>

      <hr />

      <div className="p-4">
        <h4 className="font-semibold mb-2">Manage</h4>

        <div className="space-y-2 text-gray-600">
          <p>Posts & Activity</p>
          <p>Job Posting Account</p>
        </div>
      </div>

      <hr />

      <button className="w-full text-left p-4 hover:bg-gray-100">
        Sign Out
      </button>
    </div>
  );
};

export default ProfileDropdown;