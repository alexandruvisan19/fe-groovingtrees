import { categoryPathBySlug } from 'lib/categories';
import Link from 'next/link';
import { TbTree } from 'react-icons/tb';
import { AiOutlineRight } from 'react-icons/ai';
import { TbMinusVertical } from 'react-icons/tb';

const Breadcrumbs = ({ categories, slug, title }) => {
  return (
    <div className="prose-hr:mt-1 prose-hr:mb-4 md:prose-hr:mt-1 md:prose-hr:mb-4 prose-a:no-underline">
      <nav className="flex items-center text-sm md:text-base mb-4">
        <Link href="/">
          <a className="hover:text-autumn-300 text-lg">
            <TbTree />
          </a>
        </Link>

        <span className="mr-1">
          <TbMinusVertical className="relative top-px" />
        </span>
        <span title={categories.map(({ name }) => name).join(', ')}>
          <Link href={categoryPathBySlug(categories[0]?.slug)}>
            <a className="mr-1 hover:underline">{categories[0]?.name}</a>
          </Link>
        </span>

        <span className="mr-1">
          <AiOutlineRight className="text-xs relative top-px" />
        </span>
        <Link href={`${slug}`}>
          <a className="overflow-ellipsis whitespace-nowrap overflow-hidden hover:underline">{title}</a>
        </Link>
      </nav>
      <hr className="block md:hidden" />
    </div>
  );
};

export default Breadcrumbs;
