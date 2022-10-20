import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { useState, useRef, useEffect, useCallback } from 'react';

import { getPostBySlug, getRecentPosts, postPathBySlug } from 'lib/posts';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';
import useSearch from 'hooks/use-search';
import { FaSearch } from 'react-icons/fa';

import Layout from 'components/Layout';
import HeaderPost from 'components/HeaderPost';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import MetadataPost from 'components/MetadataPost';
import FeaturedImage from 'components/FeaturedImage';
import TableOfContents from 'components/TableOfContents';
import RecentPosts from 'components/RecentPosts';
import Breadcrumbs from 'components/Breadcrumbs';

// import { getRelatedPosts } from 'lib/posts';
// import { categoryPathBySlug } from 'lib/categories';

const SEARCH_HIDDEN = 'hidden';

export default function Post({ post, socialImage }) {
  const {
    title,
    metaTitle,
    description,
    date,
    author,
    categories,
    modified,
    featuredImage,
    content,
    slug,
    readingTime,
  } = post;
  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const formRef = useRef();
  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  useEffect(() => {
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
    }

    addDocumentOnClick();
    addResultsRoving();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  function handleResultsRoving(e) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearSearch();
      setSearchVisibility(SEARCH_HIDDEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { metadata: siteMetadata = {}, homepage, recentPosts = [] } = useSite();

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const metadataOptions = {
    compactCategories: false,
  };

  // const { posts: relatedPostsList, title: relatedPostsTitle } = related || {};

  console.log(post);

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <div className="max-w-65xl m-auto block lg:flex pt-0 md:pt-8">
        <div className="prose prose-w-md prose-img:rounded-xl prose-figcaption:text-center hover:prose-img:shadow-lg max-w-none pl-4 pr-4 md:pr-12 lg:border-r mx-auto">
          <HeaderPost>
            <Breadcrumbs categories={categories} options={metadataOptions} slug={slug} title={title} />
            <h1
              className="!mb-4"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <MetadataPost date={date} author={author} options={metadataOptions} readingTime={readingTime} />
            {featuredImage && (
              <FeaturedImage
                {...featuredImage}
                src={featuredImage.sourceUrl}
                dangerouslySetInnerHTML={featuredImage.caption}
              />
            )}
          </HeaderPost>
          <Content>
            <Section>
              <Container>
                <div
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                <div className="text-center mt-8 text-gray-500 text-base">
                  <p>Last updated on {formatDate(modified)}.</p>
                  {/* {Array.isArray(relatedPostsList) && relatedPostsList.length > 0 && (
                    <div>
                      <span>
                        More from{' '}
                        <Link href={relatedPostsTitle.link}>
                          <a>{relatedPostsTitle.name}</a>
                        </Link>
                      </span>
                    </div>
                  )} */}
                </div>
              </Container>
            </Section>
          </Content>
        </div>

        <aside className="prose prose-lg md:prose-xl mt-2 sm:ml-6 pl-4 pr-4 hidden lg:block">
          <div>
            <form
              className="flex items-center relative w-full max-h-full p-1"
              ref={formRef}
              action="/search"
              data-search-is-active={!!query}
            >
              <input
                className="pr-2 pl-2 border-2 border-autumn-300"
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="Search this website"
                required
              />
              <button
                className="flex items-center pr-2 pl-2 bg-autumn-300 text-black border-2 border-autumn-300"
                type="submit"
              >
                Search <FaSearch className="pl-1" size={18} />
              </button>
              <div
                className={
                  !query
                    ? 'hidden'
                    : 'block absolute top-full w-full bg-white p-2 shadow-lg rounded-sm z-40 border border-gray-200'
                }
              >
                {results.length > 0 && (
                  <ul className="list-none !pl-0">
                    {results.map(({ slug, title }, index) => {
                      return (
                        <li className="prose-li:pl-0" key={slug}>
                          <Link tabIndex={index} href={postPathBySlug(slug)}>
                            <a className="no-underline hover:text-autumn-300 hover:underline">{title}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {results.length === 0 && (
                  <p>
                    Sorry, not finding anything for <strong>{query}</strong>
                  </p>
                )}
              </div>
            </form>
          </div>

          {recentPosts.length > 0 && <RecentPosts recentPosts={recentPosts} />}

          <TableOfContents content={content} />
        </aside>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);
  if (!post) {
    return {
      props: {},
      notFound: true,
    };
  }

  const props = {
    post,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
  };

  // const { categories, databaseId: postId } = post;

  // const { category: relatedCategory, posts: relatedPosts } = (await getRelatedPosts(categories, postId)) || {};
  // console.log(relatedPosts);
  // const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  // if (hasRelated) {
  //   props.related = {
  //     posts: relatedPosts,
  //     title: {
  //       name: relatedCategory.name || null,
  //       link: categoryPathBySlug(relatedCategory.slug),
  //     },
  //   };
  // }

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  const { posts } = await getRecentPosts({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}
