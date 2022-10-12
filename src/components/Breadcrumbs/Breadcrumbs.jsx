import { categoryPathBySlug } from 'lib/categories';
import Link from 'next/link';
import { TbHome } from 'react-icons/tb';
import { AiOutlineRight } from 'react-icons/ai';
import { TbMinusVertical } from 'react-icons/tb';

const Breadcrumbs = ({ categories, slug, title }) => {
  return (
    <nav className="flex flex-wrap items-center text-sm mb-4">
      <Link href="/">
        <a className="mr-1">
          <TbHome />
        </a>
      </Link>
      <span className="mr-1">
        <TbMinusVertical />
      </span>
      <Link href="/categories/">
        <a className="mr-1">Categories</a>
      </Link>
      {categories.length !== 0 && (
        <>
          <span className="mr-1">
            <AiOutlineRight />
          </span>
          <span title={categories.map(({ name }) => name).join(', ')}>
            <Link href={categoryPathBySlug(categories[0]?.slug)}>
              <a className="mr-1">{categories[0]?.name}</a>
            </Link>
          </span>
        </>
      )}
      <span className="mr-1">
        <AiOutlineRight />
      </span>
      <Link href={`${slug}`}>
        <a>{title}</a>
      </Link>
    </nav>
  );
};

export default Breadcrumbs;
