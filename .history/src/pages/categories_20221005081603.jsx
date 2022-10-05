import Link from 'next/link';
import { Helmet } from 'react-helmet';

import useSite from 'hooks/use-site';
import { getAllCategories, categoryPathBySlug } from 'lib/categories';
import { WebpageJsonLd } from 'lib/json-ld';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';

export default function Categories({ categories }) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;
  const title = 'Categories';
  const slug = 'categories';
  let metaDescription = `Read ${categories.length} categories at ${siteTitle}.`;

  return (
    <Layout>
      <Helmet>
        <title>Categories</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>

      <WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

      <Header>
        <Container>
          <h1>Categories</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <ul className="flex flex-wrap">
            {categories.map((category) => {
              return (
                <li className="p-4" key={category.slug}>
                  <Link href={categoryPathBySlug(category.slug)}>
                    <a>{category.name}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { categories } = await getAllCategories();

  return {
    props: {
      categories,
    },
  };
}
