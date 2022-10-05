import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { useState, useRef, useEffect, useCallback } from 'react';

import { getPostBySlug, getRecentPosts, getRelatedPosts, postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
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

import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import parameterize from 'parameterize';
import { visit } from 'unist-util-visit';

const SEARCH_HIDDEN = 'hidden';

export default function Post({ post, socialImage, related }) {
  const { title, metaTitle, description, date, author, categories, modified, featuredImage, excerpt } = post;
  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const formRef = useRef();

  const toc = [];

  const content = unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(() => {
      return (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName === 'h2') {
            const id = parameterize(node.children[0].value);
            node.properties.id = id;

            toc.push({
              id,
              title: node.children[0].value,
            });
          }
        });
      };
    })
    .use(rehypeStringify)
    .processSync(post.content)
    .toString();

  // const { title } = metadata;

  // const hasRecentCategories = Array.isArray(categories) && categories.length > 0;

  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
    }

    addDocumentOnClick();
    addResultsRoving();

    // When the search box opens up, additionall find the search input and focus
    // on the element so someone can start typing right away

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  /**
   * addDocumentOnClick
   */

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * removeDocumentOnClick
   */

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * handleOnDocumentClick
   */

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  /**
   * handleOnSearch
   */

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  /**
   * addResultsRoving
   */

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  /**
   * removeResultsRoving
   */

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  /**
   * handleResultsRoving
   */

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

  /**
   * escFunction
   */

  // pressing esc while search is focused will close it

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

  const { posts: relatedPostsList, title: relatedPostsTitle } = related || {};

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <div className="block lg:flex pt-0 md:pt-8">
        <div className="prose prose-xl prose-lime prose-w-md prose-img:rounded-xl prose-figcaption:text-center hover:prose-a:text-trees5-500 hover:prose-img:shadow-lg max-w-none pl-4 pr-4 sm:pr-12 lg:border-r mx-auto">
          <HeaderPost>
            <h1
              className="text-center !mb-4"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <MetadataPost date={date} author={author} categories={categories} options={metadataOptions} />
            {featuredImage && (
              <FeaturedImage
                {...featuredImage}
                src={featuredImage.sourceUrl}
                dangerouslySetInnerHTML={featuredImage.caption}
              />
            )}
            {excerpt && (
              <div
                dangerouslySetInnerHTML={{
                  __html: excerpt,
                }}
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
                  {Array.isArray(relatedPostsList) && relatedPostsList.length > 0 && (
                    <div>
                      <span>
                        More from{' '}
                        <Link href={relatedPostsTitle.link}>
                          <a>{relatedPostsTitle.name}</a>
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              </Container>
            </Section>
          </Content>
        </div>

        <aside className="prose prose-lg md:prose-xl prose-a:text-trees5-100 hover:prose-a:text-trees5-200 mt-2 sm:ml-6 pl-4 pr-4 hidden lg:block">
          <div>
            <form
              className="flex items-center relative w-full max-h-full p-1"
              ref={formRef}
              action="/search"
              data-search-is-active={!!query}
            >
              <input
                className="pr-2 pl-2 border border-blue-600"
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="Search this website"
                required
              />
              <button
                className="flex items-center pr-2 pl-2 bg-blue-600 text-white border border-blue-600"
                type="submit"
              >
                Search <FaSearch className="pl-1" size={18} />
              </button>
              <div
                className={
                  !query
                    ? 'hidden'
                    : 'block absolute top-full w-full bg-white p-2 shadow-sm rounded-sm z-40 border-4 border-yellow-700'
                }
              >
                {results.length > 0 && (
                  <ul className="list-none !pl-0">
                    {results.map(({ slug, title }, index) => {
                      return (
                        <li className="prose-li:pl-0" key={slug}>
                          <Link tabIndex={index} href={postPathBySlug(slug)}>
                            <a className="no-underline hover:text-yellow-700 hover:underline">{title}</a>
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

          <div>
            <p className="font-semibold !mb-0">Recent Posts 🎋</p>
            <ul className="list-none !pl-0 !text-base !mt-0">
              {recentPosts.map((post) => {
                const { id, slug, title } = post;
                return (
                  <li className="!pl-0" key={id}>
                    <Link href={postPathBySlug(slug)}>
                      <a className="no-underline hover:text-yellow-700 hover:underline">{title}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

{toc}
        </aside>
      </div>

      {/* <Section>
        <Container>
        </Container>
      </Section> */}
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

  const { categories, databaseId: postId } = post;

  const props = {
    post,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
  };

  const { category: relatedCategory, posts: relatedPosts } = (await getRelatedPosts(categories, postId)) || {};
  const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  if (hasRelated) {
    props.related = {
      posts: relatedPosts,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

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
