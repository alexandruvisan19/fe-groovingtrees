import Link from 'next/link';

import config from '../../../package.json';
import { Helmet } from 'react-helmet';

import { GrPrevious as PreviousIcon, GrNext as NextIcon } from 'react-icons/gr';
import { HiOutlineDotsHorizontal as Dots } from 'react-icons/hi';

const MAX_NUM_PAGES = 9;

const { homepage = '' } = config;

const Pagination = ({ pagesCount, currentPage, basePath, addCanonical = true }) => {
  const path = `${basePath}/page/`;

  const hasPreviousPage = pagesCount > 1 && currentPage > 1;
  const hasNextPage = pagesCount > 1 && currentPage < pagesCount;

  let hasPrevDots = false;
  let hasNextDots = false;

  function getPages() {
    let pages = pagesCount;
    let start = 0;
    // If the number of pages exceeds the max
    if (pagesCount > MAX_NUM_PAGES) {
      // Set number of pages to the max
      pages = MAX_NUM_PAGES;
      const half = Math.ceil(MAX_NUM_PAGES / 2);
      const isHead = currentPage <= half;
      const isTail = currentPage > pagesCount - half;
      hasNextDots = !isTail;
      // If the current page is at the head, the start variable remains 0
      if (!isHead) {
        hasPrevDots = true;
        // If the current page is at the tail, the start variable is set to
        // the last chunk. Otherwise the start variable will place the current
        // page at the middle
        start = isTail ? pagesCount - MAX_NUM_PAGES : currentPage - half;
      }
    }
    return [...new Array(pages)].map((_, i) => i + 1 + start);
  }

  const pages = getPages();

  return (
    <>
      <Helmet>
        {addCanonical && !hasPreviousPage && <link rel="canonical" href={`${homepage}${basePath}`} />}
        {hasPreviousPage && <link rel="prev" href={`${homepage}${path}${currentPage - 1}`} />}
        {hasNextPage && <link rel="next" href={`${homepage}${path}${currentPage + 1}`} />}
      </Helmet>

      <hr />
      <nav
        className="flex justify-end mt-6 mb-6 relative items-center pr-4 pl-4 font-bold"
        role="navigation"
        aria-label="Pagination Navigation"
      >
        {hasPreviousPage && (
          <Link href={`/`}>
            <a
              className="mr-auto flex items-center bg-trees1-200 border pt-2 pb-2 pl-4 pr-4 rounded-md hover:bg-trees1-500 shadow-sm"
              aria-label="Goto Previous Page"
            >
              <PreviousIcon /> Previous
            </a>
          </Link>
        )}

        <ul className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2 flex">
          {hasPrevDots && (
            <li className="hidden md:flex self-end m-[-0.2rem]">
              <Dots aria-label={`Navigation to pages 1-${pages[0] - 1} hidden`} />
            </li>
          )}
          {pages.map((page) => {
            const active = page === currentPage;
            return active ? (
              <li className="hidden md:block" key={page}>
                <span
                  className="pt-2 pb-2 pl-4 pr-4 font-semibold shadow-sm"
                  aria-label={`Current Page, Page ${page}`}
                  aria-current="true"
                >
                  {page}
                </span>
              </li>
            ) : (
              <li className="hidden md:block" key={page}>
                <Link href={`${path}${page}`}>
                  <a aria-label={`Goto Page ${page}`}>
                    <span className="bg-trees1-200 border rounded-md pt-2 pb-2 pl-4 pr-4 font-medium hover:bg-trees1-500 shadow-sm">
                      {page}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
          {hasNextDots && (
            <li className="hidden md:flex self-end m-[-0.2rem]">
              <Dots aria-label={`Navigation to pages ${pages[pages.length - 1] + 1}-${pagesCount} hidden`} />
            </li>
          )}
        </ul>

        {hasNextPage && (
          <Link href={`${path}${currentPage + 1}`}>
            <a
              className="flex items-center bg-trees1-200 border pt-2 pb-2 pl-4 pr-4 rounded-md hover:bg-trees1-500 shadow-sm"
              aria-label="Goto Next Page"
            >
              Next <NextIcon />
            </a>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Pagination;
