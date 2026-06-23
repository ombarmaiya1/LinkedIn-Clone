import {
  Image,
  Video,
  FileText,
} from "lucide-react";

const CreatePost = () => {
  return (
    <div className="bg-white p-4 rounded-xl border">

      <div className="flex gap-3">

        <img
          src="https://i.pravatar.cc/100"
          className="w-12 h-12 rounded-full"
        />

        <button
          className="
          flex-1
          border
          rounded-full
          px-5
          text-left
          hover:bg-gray-100
          "
        >
          Start a post
        </button>

      </div>

      <div className="flex justify-around mt-4">

        <button className="flex gap-2">
          <Video size={18} />
          Video
        </button>

        <button className="flex gap-2">
          <Image size={18} />
          Photo
        </button>

        <button className="flex gap-2">
          <FileText size={18} />
          Article
        </button>

      </div>

    </div>
  );
};

export default CreatePost;