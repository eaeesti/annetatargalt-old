import Markdown from "react-markdown";

const ProgressResults = ({ data }) => {
  return (
    <div className="text-gray-600 bg-white">
      <div className="container flex flex-col py-40 space-y-8 text-center">
        {data.title && (
          <div className="mb-8 text-2xl font-bold sm:text-3xl md:text-4xl text-primary-700">
            {data.title}
          </div>
        )}
        {data.content && (
          <div className="max-w-full text-gray-600 prose prose-xl">
            <Markdown>{data.content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressResults;
