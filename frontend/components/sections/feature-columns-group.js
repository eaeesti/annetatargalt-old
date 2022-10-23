import NextImage from "../elements/image";

const FeatureColumnsGroup = ({ data }) => {
  return (
    <div className="bg-white">
      <div className="container flex flex-col items-center py-32 text-center">
        <div className="text-4xl font-bold tracking-tight text-primary-700">
          {data.title}
        </div>
        <div className="mt-12 max-w-2xl text-lg">{data.description}</div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 mt-36 align-top sm:grid-cols-2 xl:grid-cols-4">
          {data.features.map((feature) => (
            <div
              className="flex flex-col flex-1 justify-start items-center px-6 py-12 space-y-4 text-lg bg-gray-100 rounded-2xl"
              key={feature.id}
            >
              <div className="p-6 -mt-24 mb-6 w-24 h-24 rounded-xl shadow-xl bg-primary-700">
                <NextImage media={feature.icon} unoptimized />
              </div>
              <h3 className="text-xl font-bold text-primary-700">
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureColumnsGroup;
