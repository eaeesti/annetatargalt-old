import React from "react";
import NextImage from "../elements/image";
import NextImage2 from "../elements/image2";

const BlogPostsSection = ({ data }) => {
  return (
    <div className="py-16 bg-white sm:py-24">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 auto-rows-fr gap-8 mx-auto max-w-2xl lg:mx-0 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {Array(5)
            .fill(data.blogPosts[0])
            .map((post) => (
              <article
                key={post.id}
                className="flex isolate overflow-hidden relative flex-col justify-end px-8 pt-80 pb-8 rounded-2xl transition-all cursor-pointer group bg-primary-900 sm:pt-48 lg:pt-80 group-hover:justify-start"
              >
                {post.image && (
                  <div className="absolute inset-0 h-full -z-10">
                    <NextImage2 media={post.image} className="object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 -z-10" />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-slate-900/40 group-hover:opacity-100 -z-10" />
                {/* <div className="absolute inset-0 rounded-2xl ring-1 ring-inset -z-10 ring-primary-900/10" /> */}

                <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-4">
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
                    <a href={post.href}>{post.title}</a>
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
