import Link from 'next/link';

import useSite from 'hooks/use-site';
import { categoryPathBySlug } from 'lib/categories';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';

import Section from 'components/Section';
import Container from 'components/Container';
import NavListItem from 'components/NavListItem';

const Footer = () => {
  const { metadata = {}, recentPosts = [], categories = [], menus } = useSite();
  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  const navigation = findMenuByLocation(menus, [
    process.env.WORDPRESS_MENU_LOCATION_NAVIGATION,
    MENU_LOCATION_NAVIGATION_DEFAULT,
  ]);

  return (
    <footer className="border-t bg-trees1-200">
      <div className="max-w-65xl m-auto mt-2 mb-2 text-left">
        {hasMenu && (
          <Section>
            <Container>
              <ul className="block md:flex flex-wrap justify-evenly md:flex-nowrap">
                <li className="p-6">
                  <p className="text-lg font-semibold">Company</p>
                  <ul>
                    {navigation?.map((listItem) => {
                      return <NavListItem key={listItem.id} item={listItem} />;
                    })}
                  </ul>
                </li>
                {hasRecentCategories && (
                  <li className="p-6">
                    <Link href="/categories/">
                      <p className="text-lg font-semibold">Categories</p>
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
                <li className="p-6">
                  <p className="text-lg font-semibold">More</p>
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
