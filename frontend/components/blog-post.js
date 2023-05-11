import BlogPostHeader from "./sections/blog-post-header";
import RichText from "./sections/rich-text";

// Display the list of sections
const BlogPost = ({ post, texts }) => {
  return (
    <div className="flex flex-col flex-grow">
      <BlogPostHeader post={post} texts={texts} />
      <RichText data={{ content: post.content }} />
    </div>
  );
};

export default BlogPost;
