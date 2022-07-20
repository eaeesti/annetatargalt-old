import React from "react";
import Markdown from "react-markdown";

const Header = ({ data }) => {
  return (
    <header className="text-center text-white bg-primary-600">
      <div className="container flex flex-col pt-40 pb-20 space-y-8 md:pt-60 md:pb-40">
        <div className="text-3xl font-bold md:text-5xl sm:text-4xl">
          {data.title}
        </div>
        {data.subtitle && (
          <div className="m-auto text-white prose prose-xl prose-header">
            <Markdown>{data.subtitle}</Markdown>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
