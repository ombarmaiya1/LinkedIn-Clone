import { useState } from "react";
import { Image, Video, FileText } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const CreatePost = ({ userData }) => {
  const [open, setOpen] = useState(false);

  if (!userData) {
    return null;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-3 items-center">
          <img
            src={userData.profileImage || DEFAULT_AVATAR}
            className="w-12 h-12 rounded-full object-cover shrink-0"
            alt="profile"
          />

          <button
            onClick={() => setOpen(true)}
            className="flex-1 border rounded-full px-5 text-left hover:bg-gray-100"
          >
            Start a post
          </button>
        </div>

        <div className="flex justify-around mt-4">
          <button className="flex gap-2 items-center">
            <Video size={18} />
            Video
          </button>

          <button className="flex gap-2 items-center">
            <Image size={18} />
            Photo
          </button>

          <button className="flex gap-2 items-center">
            <FileText size={18} />
            Article
          </button>
        </div>
      </div>

      <CreatePostModal open={open} setOpen={setOpen} userData={userData} />
    </>
  );
};

export default CreatePost;
