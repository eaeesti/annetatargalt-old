import ErrorPage from "next/error";
import {
  getPageData,
  fetchAPI,
  getGlobalData,
  getBlogPostData,
  getAllBlogPosts,
} from "utils/api";
import Sections from "@/components/sections";
import Seo from "@/components/elements/seo";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getLocalizedPaths } from "utils/localize";
import { fetchEvaluations } from "utils/impact";
import BlogPost from "@/components/blog-post";

// The file is called [[...slug]].js because we're using Next's
// optional catch all routes feature. See the related docs:
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

const DynamicPage = ({
  sections,
  blogPost,
  metadata,
  preview,
  global,
  pageContext,
  fetchedData,
}) => {
  const router = useRouter();

  // Check if the required data was provided
  if (sections?.length) {
    return (
      <Layout global={global} pageContext={pageContext}>
        {/* Add meta tags for SEO*/}
        <Seo metadata={metadata} />
        {/* Display content sections */}
        <Sections
          sections={sections}
          preview={preview}
          fetchedData={fetchedData}
        />
      </Layout>
    );
  }

  if (blogPost) {
    return (
      <Layout global={global} pageContext={pageContext}>
        <Seo metadata={metadata} />
        <BlogPost post={blogPost} texts={global.blogTexts} />
      </Layout>
    );
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>;
  }

  return <ErrorPage statusCode={404} />;
};

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const allPages = context.locales.map(async (locale) => {
    const localePages = await fetchAPI(`/pages?_locale=${locale}`);
    return localePages;
  });

  const pages = await (await Promise.all(allPages)).flat();

  const pagePaths = pages.map((page) => {
    // Decompose the slug that was saved in Strapi
    const slugArray = !page.slug ? false : page.slug.split("/");

    return {
      params: { slug: slugArray },
      // Specify the locale to render
      locale: page.locale,
    };
  });

  // TODO: Do this nicer
  const allBlogPosts = context.locales.map(async (locale) => {
    const localeBlogPosts = await fetchAPI(`/blog-posts?_locale=${locale}`);
    return localeBlogPosts;
  });

  const blogPosts = await (await Promise.all(allBlogPosts)).flat();

  const blogPostPaths = blogPosts.map((blogPost) => {
    const slugArray = ["blogi", blogPost.slug];

    return {
      params: { slug: slugArray },
      locale: blogPost.locale,
    };
  });

  const paths = pagePaths.concat(blogPostPaths);

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context;

  const globalLocale = await getGlobalData(locale);

  // TODO: Do this nicer
  if (params.slug?.length > 1 && params.slug[0] == "blogi") {
    const blogPostData = await getBlogPostData(
      { slug: params.slug },
      locale,
      preview
    );
    const metadata = {
      metaTitle: blogPostData.title,
      metaDescription: blogPostData.preview,
      twitterCardType: "summary",
      twitterUsername: null,
      shareImage: blogPostData.image,
    };
    const blogPostContext = {
      locale: blogPostData.locale,
      locales,
      defaultLocale,
      slug: blogPostData.slug,
      localizations: blogPostData.localizations,
    };
    const localizedPaths = getLocalizedPaths(blogPostContext);
    return {
      props: {
        preview,
        metadata,
        blogPost: blogPostData,
        global: globalLocale,
        pageContext: {
          ...blogPostContext,
          localizedPaths,
        },
      },
    };
  }

  // Fetch pages. Include drafts if preview mode is on
  const pageData = await getPageData(
    { slug: !params.slug ? [""] : params.slug },
    locale,
    preview
  );

  if (pageData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} };
  }

  // We have the required page data, pass it to the page component
  const { contentSections, metadata, localizations, slug } = pageData;

  const pageContext = {
    locale: pageData.locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  };

  const localizedPaths = getLocalizedPaths(pageContext);

  const fetchedData = {
    evaluations: await fetchEvaluations(),
    blogPosts: await getAllBlogPosts(locale, preview),
  };

  return {
    props: {
      preview,
      sections: contentSections,
      metadata,
      global: globalLocale,
      pageContext: {
        ...pageContext,
        localizedPaths,
      },
      fetchedData,
    },
  };
}

export default DynamicPage;
