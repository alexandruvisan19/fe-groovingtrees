import { Helmet } from 'react-helmet';
import { WebpageJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination/Pagination';

export default function TemplateArchive({ title = 'Archive', Title, posts, slug, metadata, pagination }) {
  const { metadata: siteMetadata = {} } = useSite();

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <WebpageJsonLd title={title} description={metadata.description} siteTitle={siteMetadata.title} slug={slug} />

      <Header>
        <div className="p-12">
          <h1 className="text-2xl md:text-4xl font-extrabold">{Title || title}</h1>
          {metadata.description && (
            <p
              className="text-xl md:text-2xl font-semibold"
              dangerouslySetInnerHTML={{
                __html: metadata.description,
              }}
            />
          )}
        </div>
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
                  <PostCard post={post} />
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
