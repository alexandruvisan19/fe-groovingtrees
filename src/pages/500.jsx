import Link from 'next/link';
import { Helmet } from 'react-helmet';

import Layout from 'components/Layout';
import Section from 'components/Section';
import Container from 'components/Container';

export default function Custom500() {
  return (
    <Layout>
      <Helmet>
        <title>500 - Internal Error</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Section>
        <Container>
          <h1>Internal Error</h1>
          <p>500</p>
          <p>
            Uh oh, something went wrong. Please try refreshing the page or clearing site data. If the problem persists,
            reach out to let us know!
          </p>
          <p>
            <Link href="/">
              <a>Go back home</a>
            </Link>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  return {
    props: {},
  };
}
