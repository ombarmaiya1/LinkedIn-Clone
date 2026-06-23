import {
  ThumbsUp,
  MessageCircle,
  Repeat,
  Send,
} from "lucide-react";

const FeedActions = () => {
  return (
    <div className="grid grid-cols-4 border-t">

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <ThumbsUp size={18} />
        Like
      </button>

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <MessageCircle size={18} />
        Comment
      </button>

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <Repeat size={18} />
        Repost
      </button>

      <button className="py-3 flex justify-center gap-2 hover:bg-gray-100">
        <Send size={18} />
        Send
      </button>

    </div>
  );
};

export default FeedActions;