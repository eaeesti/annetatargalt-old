import Markdown from "react-markdown";

const FunFact = ({ data }) => {
  return (
    <div className="text-gray-600 bg-slate-100">
      <div className="container py-32 text-center">
        <div className="text-2xl">{data.toptext}</div>
        <div className="py-12 text-8xl font-bold tracking-tight text-primary-700">
          {data.bigtext}
        </div>
        <div className="pb-12 text-2xl">{data.bottomtext}</div>
        <div className="text-sm">
          {data.source_prelink}{" "}
          <a
            href={data.source_link}
            className="font-bold transition-opacity text-primary-700 hover:opacity-70"
          >
            {data.source_linktext}
          </a>{" "}
          {data.source_postlink}
        </div>
      </div>
    </div>
  );
};

export default FunFact;
