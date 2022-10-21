import { Helmet } from 'react-helmet';

import { getPostBySlug, getRecentPosts } from 'lib/posts';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

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
import SearchBar from 'components/SearchBar';

// import { getRelatedPosts } from 'lib/posts';
// import { categoryPathBySlug } from 'lib/categories';

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
          <SearchBar />
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
