import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import api from "../../utils/api.js";

const CreatePostModal = ({ open, setOpen, userData }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open || !userData) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim() && !image) {
      alert("Please add a caption or image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", caption);
      if (image) {
        formData.append("image", image.file);
      }

      const response = await api.post("/post/create", formData);
      console.log("Post created:", response.data);

      setCaption("");
      setImage(null);
      setOpen(false);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-semibold text-xl">Create a post</h2>

          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* User */}
        <div className="flex gap-3 p-4">
          <img
            src={userData.profileImage || ""}
            className="w-12 h-12 rounded-full"
            alt=""
          />

          <div>
            <h3 className="font-semibold">{`${userData.firstName || ""} ${userData.lastName || ""}`}</h3>
            <p className="text-gray-500 text-sm">Post to anyone</p>
          </div>
        </div>

        {/* Caption */}
        <div className="px-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full h-40 resize-none outline-none text-lg"
          />
        </div>

        {/* Preview */}
        {image && (
          <div className="px-4 pb-4">
            <img
              src={image.preview}
              className="rounded-lg w-full max-h-80 object-cover"
              alt=""
            />
          </div>
        )}

        {/* Footer */}
        <div className="border-t p-4 flex justify-between items-center">
          <label className="cursor-pointer hover:bg-gray-100 rounded-full p-2">
            <ImagePlus className="text-green-600" />

            <input hidden type="file" accept="image/*" onChange={handleImage} />
          </label>

          <button
            onClick={handleSubmit}
            disabled={(!caption.trim() && !image) || loading}
            className={`px-6 py-2 rounded-full text-white font-semibold transition ${
              (!caption.trim() && !image) || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
