import { ThumbsUp, MessageCircle, Repeat, Send } from "lucide-react";
import CommentSection from "./CommentSection.jsx";

import api from "../../utils/api.js";
import { useContext, useMemo, useState } from "react";
import { UserDataContext } from "../../context/UserContext";

const FeedActions = ({ post }) => {
  const { userData } = useContext(UserDataContext);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const likeCount = post?.likes?.length || 0;
  const isLiked = useMemo(() => {
    if (!userData?._id) {
      return false;
    }

    return (post?.likes || []).some(
      (id) => id?.toString() === userData._id.toString(),
    );
  }, [post?.likes, userData?._id]);

  const handleLike = async () => {
    if (!post?._id || isLiking) {
      return;
    }

    try {
      setIsLiking(true);
      await api.post(`/post/like/${post._id}`);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="grid grid-cols-4 border-t">
      <button
        type="button"
        disabled={isLiking}
        className="py-3 flex justify-center gap-2 hover:bg-gray-100"
        onClick={handleLike}
      >
        <ThumbsUp
          size={18}
          className={isLiked ? "fill-blue-500 text-blue-500" : ""}
        />
        Like {likeCount ? `(${likeCount})` : ""}
      </button>

      <button
        type="button"
        className="py-3 flex justify-center gap-2 hover:bg-gray-100"
        onClick={() => setIsCommenting(!isCommenting)}
      >
        <MessageCircle size={18} />
        Comment {post?.comments?.length || 0 ? `(${post.comments.length})` : ""}
      </button>

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <Repeat size={18} />
        Repost
      </button>

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <Send size={18} />
        Send
      </button>

      {isCommenting && (
        <CommentSection initialComments={post.comments} postId={post._id} />
      )}
    </div>
  );
};

export default FeedActions;
