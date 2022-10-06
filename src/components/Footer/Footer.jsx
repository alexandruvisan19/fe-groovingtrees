import Link from 'next/link';

import useSite from 'hooks/use-site';
import { postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';

import Section from 'components/Section';
import Container from 'components/Container';

const Footer = () => {
  const { metadata = {}, recentPosts = [], categories = [] } = useSite();
  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className="border-t bg-trees1-200">
      <div className="max-w-65xl m-auto">
        {hasMenu && (
          <Section>
            <Container>
              <ul className="flex justify-between flex-wrap">
                {hasRecentPosts && (
                  <li className="p-4">
                    <Link href="/posts/">
                      <a>
                        <strong>Recent Posts</strong>
                      </a>
                    </Link>
                    <ul>
                      {recentPosts.map((post) => {
                        const { id, slug, title } = post;
                        return (
                          <li key={id}>
                            <Link href={postPathBySlug(slug)}>
                              <a>{title}</a>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}
                {hasRecentCategories && (
                  <li className="p-4">
                    <Link href="/categories/">
                      <a>
                        <strong>Categories</strong>
                      </a>
                    </Link>
                    <ul>
                      {categories.map((category) => {
                        const { id, slug, name } = category;
                        return (
                          <li key={id}>
                            <Link href={categoryPathBySlug(slug)}>
                              <a>{name}</a>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}
                <li className="p-4">
                  <p>
                    <strong>More</strong>
                  </p>
                  <ul>
                    <li>
                      <a href="/feed.xml">RSS</a>
                    </li>
                    <li>
                      <a href="/sitemap.xml">Sitemap</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </Container>
          </Section>
        )}
      </div>

      <Section>
        <Container>
          <p className="text-center bg-autumn-300 text-black font-bold">
            &copy; {new Date().getFullYear()} {title}
          </p>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;
