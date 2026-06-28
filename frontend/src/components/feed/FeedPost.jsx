import FeedActions from "./FeedActions";
import { useContext, useMemo, useState } from "react";
import api from "../../utils/api";
import { UserDataContext } from "../../context/UserContext";

const FeedPost = ({ post }) => {
  const { userData, refreshUserData } = useContext(UserDataContext);
  const [loadingConnect, setLoadingConnect] = useState(false);

  if (!post || !post.author) {
    return null;
  }

  const authorId = post.author?._id?.toString();
  const currentUserId = userData?._id?.toString();

  const relationState = useMemo(() => {
    if (!authorId || !currentUserId) {
      return "hidden";
    }

    if (authorId === currentUserId) {
      return "hidden";
    }

    const isConnected = (userData.connections || []).some(
      (id) => id?.toString() === authorId,
    );
    if (isConnected) {
      return "connected";
    }

    const isPending = (userData.connectionRequestsSent || []).some(
      (id) => id?.toString() === authorId,
    );
    if (isPending) {
      return "pending";
    }

    return "connect";
  }, [
    authorId,
    currentUserId,
    userData.connectionRequestsSent,
    userData.connections,
  ]);

  const handleConnect = async () => {
    if (!authorId || loadingConnect || relationState !== "connect") {
      return;
    }

    try {
      setLoadingConnect(true);
      await api.post(`/network/request/${authorId}`);
      await refreshUserData?.();
    } catch (error) {
      console.error("Failed to send connection request", error);
    } finally {
      setLoadingConnect(false);
    }
  };

  return (
    <div className="bg-white rounded-xl ">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <img
              src={post.author.profileImage || ""}
              className="w-12 h-12 rounded-full"
              alt="profile"
            />

            <div>
              <h3 className="font-semibold">
                {post.author.firstName} {post.author.lastName}
              </h3>

              <p className="text-sm text-gray-500">
                {post.author.headline || ""}
              </p>
            </div>
          </div>

          {relationState !== "hidden" && (
            <button
              type="button"
              disabled={loadingConnect || relationState !== "connect"}
              onClick={handleConnect}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                relationState === "connect"
                  ? "border border-blue-600 text-blue-700 hover:bg-blue-50"
                  : "border border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loadingConnect
                ? "Sending..."
                : relationState === "connected"
                  ? "Connected"
                  : relationState === "pending"
                    ? "Pending"
                    : "Connect"}
            </button>
          )}
        </div>

        <p className="mt-4">{post.description}</p>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full max-h-150 object-contain"
        />
      )}

      <FeedActions post={post} />
    </div>
  );
};

export default FeedPost;
