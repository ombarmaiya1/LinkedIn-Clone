import { Home, Users, Bell, Search, X, PlusSquare } from "lucide-react";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { UserDataContext } from "../../context/UserContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userData } = useContext(UserDataContext);
  const location = useLocation();

  const navItemClass = (isActive) =>
    `flex flex-col items-center cursor-pointer ${isActive ? "text-black" : "text-gray-700"}`;

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-300 px-4 py-2 flex flex-col justify-center relative">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Left — Logo always visible */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0A66C2] p-1 rounded shrink-0">
              <span className="text-white font-bold text-3xl">in</span>
            </div>

            {/* Search bar — desktop only */}
            <div className="hidden md:flex items-center bg-[#edf3f8] px-3 py-2 rounded-md w-75">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none ml-2 w-full"
              />
            </div>
          </div>

          {/* Mobile top right — Search icon only */}
          <div
            className="flex md:hidden items-center text-gray-700 cursor-pointer"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            {showSearch ? <X size={24} /> : <Search size={24} />}
          </div>

          {/* Right — desktop only */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/feed"
              className={navItemClass(location.pathname === "/feed")}
            >
              <Home size={24} />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              to="/network"
              className={navItemClass(location.pathname.startsWith("/network"))}
            >
              <Users size={24} />
              <span className="text-xs">My Network</span>
            </Link>
            <div className="relative flex flex-col items-center text-gray-700 cursor-pointer">
              <Bell size={24} />
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                24
              </span>
              <span className="text-xs">Notifications</span>
            </div>
            <div className="relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex flex-col items-center cursor-pointer"
              >
                <img
                  src={userData.profileImage}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs">Me</span>
              </div>

              {showProfileMenu && <ProfileDropdown userData={userData} />}
            </div>
          </div>
        </div>

        {/* Mobile Search — full width, slides under logo row */}
        {showSearch && (
          <div className="md:hidden mt-2 w-full flex items-center bg-[#edf3f8] px-3 py-2 rounded-md">
            <Search size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              autoFocus
              className="bg-transparent outline-none ml-2 w-full"
            />
          </div>
        )}
      </nav>

      {/* Bottom Navigation — mobile only */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around py-2 md:hidden z-50">
        <Link
          to="/feed"
          className={navItemClass(location.pathname === "/feed")}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/network"
          className={navItemClass(location.pathname.startsWith("/network"))}
        >
          <Users size={24} />
          <span className="text-xs">Network</span>
        </Link>

        {/* Post icon */}
        <div className="flex flex-col items-center text-gray-700 cursor-pointer">
          <PlusSquare size={24} />
          <span className="text-xs">Post</span>
        </div>

        <div className="relative flex flex-col items-center text-gray-700 cursor-pointer">
          <Bell size={24} />
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
            24
          </span>
          <span className="text-xs">Notifications</span>
        </div>
        <Link
          to="/profile"
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            src={userData.profileImage}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs">Me</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
