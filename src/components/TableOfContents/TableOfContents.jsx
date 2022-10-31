import useToc from 'hooks/use-toc';
import { useState } from 'react';
import { BsFileEarmarkArrowDownFill } from 'react-icons/bs';
import { BsFileEarmarkArrowUpFill } from 'react-icons/bs';

const TableOfContents = ({ content, isMobile }) => {
  const toc = useToc(content);
  const [tocVisibility, setTocVisibility] = useState(isMobile);

  function hideHandler() {
    setTocVisibility((prevSetTocVisibility) => !prevSetTocVisibility);
  }

  return (
    <div className={`${tocVisibility ? '' : 'sticky top-20'}`}>
      <div>
        <p className="text-black font-semibold !mb-0 border-b border-gray-200 inline text-xl">Table of Contents</p>
        {tocVisibility ? (
          <BsFileEarmarkArrowDownFill
            onClick={hideHandler}
            className="text-neutral-800 text-xl inline relative bottom-1 left-1 cursor-pointer"
          />
        ) : (
          <BsFileEarmarkArrowUpFill
            onClick={hideHandler}
            className="text-neutral-800 text-xl inline relative bottom-1 left-1 cursor-pointer"
          />
        )}
      </div>
      <ul className={'list-none !pl-0 !text-lg !mt-0 ' + (tocVisibility ? 'hidden' : 'block')}>
        {toc.map(({ id, title }) => {
          return (
            <li className="!pl-0 !mb-0 !mt-2" key={id}>
              <a className="no-underline hover:text-autumn-500 hover:underline" href={`#${id}`}>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;
