import useSite from 'hooks/use-site';
import { getPaginatedPosts } from 'lib/posts';
import { WebsiteJsonLd } from 'lib/json-ld';
import Link from 'next/link';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination';
import { postPathBySlug } from 'lib/posts';
import Background from 'assets/svg/background';

export default function Home({ posts, pagination }) {
  const { metadata = {} } = useSite();
  const { title, description } = metadata;

  return (
    <Layout>
      <WebsiteJsonLd siteTitle={title} />
      <Header>
        <div className="absolute z-10 top-1/2 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2">
          <h1
            className="text-2xl md:text-4xl font-extrabold"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
        <Background />
      </Header>
      <div className=" max-w-65xl m-auto md:pl-3 md:pr-3 text-center">
        <Section>
          <h2 className="mt-8 mb-4 pb-4 text-3xl border-b border-gray-200 font-bold">Recent Posts</h2>
          <ul className="columns-1 md:columns-2 lg:columns-3 mb-14 gap-8">
            {posts.map((post) => {
              return (
                <li
                  className="max-w-lg shadow rounded-xl text-center md:text-left align-top relative hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer my-4 mx-1 inline-block group"
                  key={post.slug}
                >
                  <Link href={postPathBySlug(post.slug)}>
                    <a>
                      <PostCard post={post} />
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          {pagination && (
            <Pagination
              addCanonical={false}
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )}
        </Section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { posts, pagination } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });
  return {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
    },
  };
}
