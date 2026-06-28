import { useState, useContext, useEffect } from "react";
import { UserDataContext } from "../../context/UserContext";
import api from "../../utils/api.js";

const CommentSection = ({ initialComments = [], postId }) => {
  const [comments, setComments] = useState(() =>
    [...initialComments].reverse(),
  );
  const [comment, setComment] = useState("");

  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    setComments([...(initialComments || [])].reverse());
  }, [initialComments]);

  const getDisplayName = (item) => {
    const firstName = item?.firstName || item?.author?.firstName || "";
    const lastName = item?.lastName || item?.author?.lastName || "";
    const username =
      item?.username || item?.author?.userName || item?.author?.username || "";
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) return fullName;
    if (username) return username;
    return "Anonymous";
  };

  const getProfileImage = (item) => {
    return item?.profileImage || item?.author?.profileImage || "";
  };

  const getCommentText = (item) => {
    return item?.comment || item?.text || item?.content || "";
  };

  const handlePost = async () => {
    if (!comment.trim() || !userData) return;

    try {
      const response = await api.post(`/post/comment/${postId}`, { comment });

      if (!response?.data?.comment) {
        return;
      }

      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      {/* Add Comment */}
      <div className="flex items-start gap-3">
        <img
          src={userData?.profileImage || ""}
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <button
            onClick={handlePost}
            className="rounded-full bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="mt-6 space-y-4">
        {comments.map((item, index) => (
          <div key={item?.id || item?._id || index} className="flex gap-3">
            <img
              src={getProfileImage(item)}
              alt=""
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />

            <div className="flex-1">
              <div className="rounded-2xl bg-gray-100 px-4 py-3">
                <h4 className="font-semibold text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                  {getDisplayName(item)}
                </h4>

                <p className="mt-1 text-sm text-gray-700 wrap-break-word">
                  {getCommentText(item)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
