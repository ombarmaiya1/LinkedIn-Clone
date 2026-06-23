import ProfileCard from "../sidebar/ProfileCard";

import CreatePost from "./CreatePost";
import FeedPost from "./FeedPost";

import { posts } from "../../data/posts";

const FeedLayout = () => {
  return (
    <div className="bg-[#f3f2ef] min-h-screen py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* Left */}

        <div className="col-span-3 space-y-3">
          <ProfileCard />
        </div>

        {/* Center */}

        <div className="col-span-6">
          <CreatePost />

          <div className="mt-4 space-y-4">
            {posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right */}

        <div className="col-span-3">
       
        </div>

      </div>
    </div>
  );
};

export default FeedLayout;