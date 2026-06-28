import ProfileCard from "../sidebar/ProfileCard";

import CreatePost from "./CreatePost";
import FeedPost from "./FeedPost";

// import { posts } from "../../data/posts";
import { UserDataContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import api from "../../utils/api";
import socket from "../../utils/socket";

const FeedLayout = () => {
  const { userData } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/post/get");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!userData?._id) {
      return;
    }

    const handleLikeEvent = ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: Array.isArray(likes) ? likes : post.likes,
              }
            : post,
        ),
      );
    };

    const handleCommentEvent = ({ postId, comment }) => {
      if (!comment) {
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const alreadyExists = (post.comments || []).some(
            (item) => item?._id?.toString() === comment?._id?.toString(),
          );
          if (alreadyExists) {
            return post;
          }

          return {
            ...post,
            comments: [...(post.comments || []), comment],
          };
        }),
      );
    };

    const handlePostCreated = (createdPost) => {
      if (!createdPost?._id) {
        return;
      }

      setPosts((prevPosts) => {
        const exists = prevPosts.some((post) => post._id === createdPost._id);
        if (exists) {
          return prevPosts;
        }

        return [createdPost, ...prevPosts];
      });
    };

    socket.on("post:liked", handleLikeEvent);
    socket.on("post:commented", handleCommentEvent);
    socket.on("post:created", handlePostCreated);

    return () => {
      socket.off("post:liked", handleLikeEvent);
      socket.off("post:commented", handleCommentEvent);
      socket.off("post:created", handlePostCreated);
    };
  }, [userData?._id]);

  if (!userData) {
    return (
      <div className="bg-[#f3f2ef] min-h-screen py-6 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f2ef] min-h-screen py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left */}

        <div className="col-span-3 space-y-3">
          {userData && <ProfileCard userData={userData} />}
        </div>

        {/* Center */}

        <div className="col-span-6">
          <CreatePost userData={userData} />

          <div className="mt-4 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading posts...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => <FeedPost key={post._id} post={post} />)
            ) : (
              <p className="text-center text-gray-500">No posts yet</p>
            )}
          </div>
        </div>

        {/* Right */}

        <div className="col-span-3"></div>
      </div>
    </div>
  );
};

export default FeedLayout;
