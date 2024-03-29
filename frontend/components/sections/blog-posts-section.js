import React from "react";
import NextImage from "../elements/image";
import NextImage2 from "../elements/image2";
import Link from "next/link";

const BlogPostsSection = ({ fetchedData }) => {
  const blogUrlPrefix = "blogi/";

  return (
    <div className="py-16 bg-white sm:py-24">
      <div className="container px-6 lg:px-8">
        <div className="grid grid-cols-1 auto-rows-fr gap-8 mx-auto max-w-2xl lg:mx-0 lg:max-w-none md:grid-cols-2 lg:grid-cols-2">
          {fetchedData.blogPosts.map((post) => (
            <article
              key={post.id}
              className="flex isolate overflow-hidden relative flex-col justify-end px-8 pt-80 pb-8 rounded-3xl transition-all group bg-primary-900 sm:pt-48 lg:pt-80"
            >
              {post.image && (
                <div className="absolute inset-0 h-full -z-10">
                  <NextImage2
                    media={post.image}
                    className="object-cover transition-transform duration-300 scale-105 group-hover:scale-100"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 -z-10" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-slate-900/70 group-hover:opacity-100 -z-10" />
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
                  <Link href="/[[...slug]]" as={blogUrlPrefix + post.slug}>
                    <a>
                      <span className="absolute inset-0 z-50" />
                      {post.title}
                    </a>
                  </Link>
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
