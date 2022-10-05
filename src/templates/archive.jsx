import { Helmet } from 'react-helmet';
import Link from 'next/link';
import { WebpageJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination/Pagination';
import { postPathBySlug } from 'lib/posts';

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
        <Container>
          <h1>{Title || title}</h1>
          {metadata.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: metadata.description,
              }}
            />
          )}
        </Container>
      </Header>

      <div className="md:pl-3 md:pr-3">
        <Section>
          <ul className="columns-1 md:columns-2 lg:columns-3 mb-14 gap-8">
            {posts.map((post) => {
              return (
                <li
                  className="shadow rounded-xl text-center md:text-left align-top relative hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer my-4 mx-1 inline-block group"
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
