import React from "react";
import NextImage from "../elements/image";
import NextImage2 from "../elements/image2";

const BlogPostsSection = ({ data }) => {
  const blogUrlPrefix = "blogi/";

  return (
    <div className="py-16 bg-white sm:py-24">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 auto-rows-fr gap-8 mx-auto max-w-2xl lg:mx-0 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {data.blogPosts.map((post) => (
            <article
              key={post.id}
              className="flex isolate overflow-hidden relative flex-col justify-end px-8 pt-80 pb-8 rounded-2xl transition-all group bg-primary-900 sm:pt-48 lg:pt-80"
            >
              {post.image && (
                <div className="absolute inset-0 h-full -z-10">
                  <NextImage2
                    media={post.image}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-primary-900/60 -z-10" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-slate-900/50 group-hover:opacity-100 -z-10" />
              <div className="mt-3 mb-0 transition-all duration-300 group-hover:mt-0 group-hover:mb-3">
                <div className="overflow-hidden text-sm text-slate-200">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("et-EE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 text-xl font-bold leading-8 text-white">
                  <a href={blogUrlPrefix + post.slug}>
                    <span className="absolute inset-0 z-50" />
                    {post.title}
                  </a>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostsSection;
