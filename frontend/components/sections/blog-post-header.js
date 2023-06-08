import React from "react";
import Markdown from "react-markdown";
import NextImage2 from "../elements/image2";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const BlogPostHeader = ({ post, texts }) => {
  return (
    <header className="isolate overflow-hidden relative py-24 text-white bg-primary-900 sm:py-32">
      <div className="absolute inset-0 h-full -z-10">
        <NextImage2 media={post.image} className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-bl -z-10 to-primary-900/80 from-slate-800/70" />
      <div className="container flex flex-col items-start pt-24 pb-10 space-y-8 max-w-4xl md:pt-36 md:pb-20">
        <Link href={texts.blogUrlPrefix}>
          <a className="inline-flex gap-x-1 items-center px-2.5 py-1.5 text-sm text-white rounded-full shadow-sm transition-colors group bg-slate-800/50 hover:bg-slate-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <ArrowLeftIcon
              className="flex-grow-0 w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {texts.goBackToBlogPosts}
          </a>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {post.title}
        </h1>
        <div className="flex space-x-3 text-xl italic md:text-2xl text-slate-300">
          {post.author && (
            <>
              <address>
                {post.author}
                {post.authorRole && <>, {post.authorRole}</>}
              </address>
              {post.author && (
                <span className="pointer-events-none select-none">•</span>
              )}
            </>
          )}

          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("et-EE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </header>
  );
};

export default BlogPostHeader;
