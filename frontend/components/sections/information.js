import React from "react";
import Markdown from "react-markdown";
import { getStrapiURL } from "../../utils/api";

const Information = ({ data }) => {
  return (
    <div className="text-white bg-primary-800">
      <div className="flex flex-row">
        <div className="flex flex-col p-16 space-y-8 w-1/2">
          <div className="text-4xl font-bold">{data.title}</div>
          <div className="flex flex-col space-y-4 text-lg text-justify">
            <Markdown>{data.content}</Markdown>
          </div>
        </div>
        <div
          className="w-1/2 bg-center bg-no-repeat"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(17, 94, 89, 0.5), rgba(17, 94, 89, 0.5))",
              `url(${getStrapiURL(data.image.url)})`,
            ],
            backgroundSize: ["auto 100%"],
          }}
        ></div>
      </div>
    </div>
  );
};

export default Information;
