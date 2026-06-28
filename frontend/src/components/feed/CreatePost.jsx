import { useState } from "react";
import { Image, Video, FileText } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

const CreatePost = ({ userData }) => {
  const [open, setOpen] = useState(false);

  if (!userData) {
    return null;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-xl">
        <div className="flex gap-3">
          <img
            src={userData.profileImage || ""}
            className="w-12 h-12 rounded-full"
            alt=""
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
