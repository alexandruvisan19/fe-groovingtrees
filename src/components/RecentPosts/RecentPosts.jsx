import { postPathBySlug } from 'lib/posts';
import Link from 'next/link';

const RecentPosts = ({ recentPosts }) => {
  return (
    <>
      <p className="font-semibold !mb-0 border-b border-gray-200">Recent Posts 🎋</p>
      <ul className="list-none !pl-0 !text-base !mt-0">
        {recentPosts.map((post) => {
          const { id, slug, title } = post;
          return (
            <li className="!pl-0" key={id}>
              <Link href={postPathBySlug(slug)}>
                <a className="no-underline hover:text-autumn-500 hover:underline">{title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RecentPosts;
