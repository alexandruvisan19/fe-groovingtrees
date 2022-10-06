import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

import useSite from 'hooks/use-site';
import useSearch from 'hooks/use-search';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import Section from 'components/Section';

import { categoryPathBySlug } from 'lib/categories';

const SEARCH_HIDDEN = 'hidden';

const Nav = () => {
  const formRef = useRef();

  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const [menu, setMenu] = useState(true);

  const { metadata = {}, categories = [] } = useSite();
  const { title } = metadata;

  const { clearSearch } = useSearch({
    maxResults: 5,
  });

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    // When the search box opens up, additionall find the search input and focus
    // on the element so someone can start typing right away

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  /**
   * addDocumentOnClick
   */

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * removeDocumentOnClick
   */

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * handleOnDocumentClick
   */

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  /**
   * addResultsRoving
   */

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  /**
   * removeResultsRoving
   */

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  /**
   * handleResultsRoving
   */

  function handleResultsRoving(e) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  /**
   * escFunction
   */

  // pressing esc while search is focused will close it

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearSearch();
      setSearchVisibility(SEARCH_HIDDEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMenu() {
    let list = document.querySelector('.menu');

    if (menu) {
      list.classList.add('opacity-100');
      list.classList.remove('opacity-0');
    } else {
      list.classList.add('opacity-0');
      list.classList.remove('opacity-100');
    }
    setMenu(!menu);
  }

  return (
    <nav className="sticky top-0 z-50  border-b bg-white border-gray-200">
      <Section className="max-w-65xl m-auto">
        <div className="flex justify-between items-center z-15">
          <Link href="/">
            <a className="hover:text-gray-900 block font-bold text-2xl p-4 text-gray-600">{title}</a>
          </Link>

          <span className="md:hidden mr-4 block cursor-pointer">
            {menu ? (
              <FiMenu name="menu" className="text-3xl" onClick={handleMenu} />
            ) : (
              <IoClose className="text-3xl" name="close" onClick={handleMenu} />
            )}
          </span>

          <ul className="menu md:flex md:items-center z-[-1] text-lg md:z-auto md:static absolute  w-full left-0 md:w-auto md:py-0 md:pl-0 pl-4 pb-4 md:opacity-100 opacity-0 top-[65px] transition shadow-lg md:shadow-none bg-white">
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
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
