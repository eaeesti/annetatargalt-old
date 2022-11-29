import classNames from "classnames";
import NextImage from "../elements/image";
import Video from "../elements/video";
import CustomLink from "../elements/custom-link";
import Markdown from "react-markdown";

const FeatureRowsGroup = ({ data }) => {
  return (
    <div className="bg-white">
      <div className="container flex flex-col px-0 pt-64 pb-32 space-y-64 sm:px-4 lg:py-32 lg:space-y-32">
        {data.features.map((feature, index) => (
          <div
            className={classNames(
              // Common classes
              "flex flex-col justify-start items-center md:justify-between space-y-16 lg:space-y-0 bg-slate-100 p-12 sm:p-24 sm:rounded-2xl",
              {
                "lg:flex-row lg:ml-40 xl:ml-48": index % 2 === 0,
                "lg:flex-row-reverse lg:mr-40 xl:mr-48": index % 2 === 1,
              }
            )}
            key={feature.id}
          >
            {/* Media section */}
            <div
              className={classNames(
                "w-64 shadow-xl md:w-64 lg:w-80 xl:w-96 -mt-44 sm:-mt-56 lg:mt-0",
                {
                  "lg:-ml-64 xl:-ml-72": index % 2 === 0,
                  "lg:-mr-64 xl:-mr-72": index % 2 === 1,
                }
              )}
            >
              {/* Images */}
              {feature.media.mime.startsWith("image") && (
                <div className="w-full h-auto">
                  <NextImage
                    media={feature.media}
                    className="bg-white rounded-3xl shadow-2xl"
                  />
                </div>
              )}
              {/* Videos */}
              {feature.media.mime.startsWith("video") && (
                <Video
                  media={media}
                  className="w-full h-auto"
                  autoPlay
                  controls={false}
                />
              )}
            </div>
            {/* Text section */}
            <div className="w-full text-lg lg:w-5/6">
              <h1 className="text-2xl font-bold tracking-tight text-primary-700">
                {feature.title}
              </h1>
              <div className="my-6 text-gray-600 prose prose-lg">
                <Markdown>{feature.description}</Markdown>
              </div>
              {feature.link && (
                <CustomLink link={feature.link}>
                  <div className="text-primary-700 with-arrow hover:underline">
                    {feature.link.text}
                  </div>
                </CustomLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureRowsGroup;
