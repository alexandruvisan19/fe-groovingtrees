import useToc from 'hooks/use-toc';
import { useState } from 'react';
import { BsArrowUpShort } from 'react-icons/bs';
import { BsArrowDownShort } from 'react-icons/bs';

const TableOfContents = ({ content }) => {
  const toc = useToc(content);
  const [tocVisibility, setTocVisibility] = useState(true);

  function hideHandler() {
    setTocVisibility((prevSetTocVisibility) => !prevSetTocVisibility);
  }

  return (
    <div className="sticky top-20">
      <div>
        <p className="font-semibold !mb-0 border-b border-gray-200 inline">Table of Contents 📑</p>
        {tocVisibility ? (
          <BsArrowUpShort onClick={hideHandler} className="inline" />
        ) : (
          <BsArrowDownShort onClick={hideHandler} className="inline" />
        )}
      </div>
      <ul className={'list-none !pl-0 !text-base !mt-0 ' + (tocVisibility ? 'block' : 'hidden')}>
        {toc.map(({ id, title, subTitle }) => {
          return (
            <>
              <li className="!pl-0" key={id}>
                <a className="no-underline hover:text-autumn-500 hover:underline" href={`#${id}`}>
                  {title}
                </a>
              </li>
              {subTitle && (
                <li>
                  <ul>
                    <li>
                      <a href={`#${id}`}>{subTitle}</a>
                    </li>
                  </ul>
                </li>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;
