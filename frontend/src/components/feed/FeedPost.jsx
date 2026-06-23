
const FeedPost = ({ post }) => {
  return (
    <div className="bg-white rounded-xl border">

      <div className="p-4">

        <div className="flex gap-3">

          <img
            src={post.avatar}
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold">
              {post.name}
            </h3>

            <p className="text-sm text-gray-500">
              {post.role}
            </p>
          </div>

        </div>

        <p className="mt-4">
          {post.caption}
        </p>

      </div>

      <img
        src={post.image}
        className="w-full"
      />



    </div>
  );
};

export default FeedPost;