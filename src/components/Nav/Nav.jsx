import { useState } from 'react';
import Link from 'next/link';

import useSite from 'hooks/use-site';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import Section from 'components/Section';

import { categoryPathBySlug } from 'lib/categories';

const Nav = () => {
  const [menu, setMenu] = useState(true);

  const { metadata = {}, categories = [] } = useSite();
  const { title } = metadata;

  function handleMenu() {
    let list = document.querySelector('.menu');

    if (menu) {
      list.classList.add('opacity-100');
      list.classList.remove('opacity-0');
      list.classList.remove('hidden');
    } else {
      list.classList.add('opacity-0');
      list.classList.add('hidden');
      list.classList.remove('opacity-100');
    }
    setMenu(!menu);
  }

  return (
    <nav className="sticky top-0 z-50  border-b bg-white border-gray-200">
      <Section className="max-w-65xl m-auto">
        <div className="flex justify-between items-center z-15">
          <Link href="/">
            <a className="text-gray-900 hover:text-black block font-bold text-2xl p-4">{title}</a>
          </Link>

          {categories.length >= 1 && (
            <>
              <span className="md:hidden mr-4 block cursor-pointer">
                {menu ? (
                  <FiMenu name="menu" className="text-3xl" onClick={handleMenu} />
                ) : (
                  <IoClose className="text-3xl" name="close" onClick={handleMenu} />
                )}
              </span>
              <ul className="menu md:flex md:items-center z-[-1] text-lg md:z-auto md:static absolute  w-full left-0 md:w-auto md:py-0 md:pl-0 pl-4 pb-4 md:opacity-100 opacity-0 top-[65px] transition shadow-lg md:shadow-none bg-white hidden">
                {categories.map((category) => {
                  const { id, slug, name } = category;
                  return (
                    <li
                      className="md:pl-3 md:pr-3 pt-3 pb-3 mr-2 hover:text-gray-900 hover:underline rounded-md transition font-medium"
                      key={id}
                    >
                      <Link href={categoryPathBySlug(slug)}>
                        <a className="text-gray-600">{name}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
