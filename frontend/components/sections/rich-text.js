import PropTypes from "prop-types";
import Markdown from "react-markdown";

const RichText = ({ data }) => {
  return (
    <div className="container py-12 max-w-4xl text-slate-600 prose prose-md sm:prose-lg">
      <Markdown>{data.content}</Markdown>
    </div>
  );
};

RichText.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }),
};

export default RichText;
