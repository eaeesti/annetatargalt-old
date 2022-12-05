const FunFact = ({ data }) => {
  return (
    <div className="bg-primary-700 text-primary-100">
      <div className="container flex flex-col items-center py-32 text-center">
        <div className="text-2xl">{data.toptext}</div>
        <div className="my-12 text-7xl font-bold tracking-tight text-white sm:text-8xl">
          {data.bigtext}
        </div>
        <div className="pb-12 text-2xl">{data.bottomtext}</div>
        <div className="text-sm">
          {data.source_prelink}{" "}
          <a
            href={data.source_link}
            className="font-bold transition-opacity text-primary-300 hover:opacity-70"
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
