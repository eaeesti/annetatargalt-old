import PropTypes from "prop-types";
import Markdown from "react-markdown";

const RichText = ({ data }) => {
  return (
    <div className="container py-12 text-gray-600 prose prose-lg">
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
