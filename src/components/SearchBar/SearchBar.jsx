import { useCallback, useEffect, useRef, useState } from 'react';
import useSearch from 'hooks/use-search';
import { FaSearch } from 'react-icons/fa';
import { postPathBySlug } from 'lib/posts';
import Link from 'next/link';

const Search = () => {
  const formRef = useRef();
  const SEARCH_HIDDEN = 'hidden';
  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);

  useEffect(() => {
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
    }

    addDocumentOnClick();
    addResultsRoving();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

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

  return (
    <form
      className="flex items-center relative w-full max-h-full p-1"
      ref={formRef}
      action="/search"
      data-search-is-active={!!query}
    >
      <input
        className="pr-2 pl-2 border-2 border-autumn-300"
        type="search"
        name="q"
        value={query || ''}
        onChange={handleOnSearch}
        autoComplete="off"
        placeholder="Search this website"
        required
      />
      <button className="flex items-center pr-2 pl-2 bg-autumn-300 text-black border-2 border-autumn-300" type="submit">
        Search <FaSearch className="pl-1" size={18} />
      </button>
      <div
        className={
          !query
            ? 'hidden'
            : 'block absolute top-full w-full bg-white p-2 shadow-lg rounded-sm z-40 border border-gray-200'
        }
      >
        {results.length > 0 && (
          <ul className="list-none !pl-0">
            {results.map(({ slug, title }, index) => {
              return (
                <li className="prose-li:pl-0" key={slug}>
                  <Link tabIndex={index} href={postPathBySlug(slug)}>
                    <a className="no-underline hover:text-autumn-300 hover:underline">{title}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {results.length === 0 && (
          <p>
            Sorry, not finding anything for <strong>{query}</strong>
          </p>
        )}
      </div>
    </form>
  );
};

export default Search;
