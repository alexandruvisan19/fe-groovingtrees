import Link from 'next/link';
import { Helmet } from 'react-helmet';

import Layout from 'components/Layout';
import Section from 'components/Section';

export default function Custom404() {
  return (
    <Layout>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Section>
        <div className="flex flex-col items-center m-14 p-2 prose max-w-full h-[40vh]">
          <h1>Page Not Found</h1>
          <p className="text-4xl !mt-2 !mb-6">404</p>
          <p className="!mb-0 !mt-0">The page you were looking for could not be found.</p>
          <p className="!mt-0">
            <Link href="/">
              <a className="text-blue-600">Go back home</a>
            </Link>
          </p>
        </div>
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
