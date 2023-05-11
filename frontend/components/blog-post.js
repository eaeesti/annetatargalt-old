import Header from "./sections/header";
import RichText from "./sections/rich-text";

// Display the list of sections
const BlogPost = ({ data }) => {
  return (
    <div className="flex flex-col flex-grow">
      <Header data={{ title: data.title }} />
      <RichText data={{ content: data.content }} />
    </div>
  );
};

export default BlogPost;
