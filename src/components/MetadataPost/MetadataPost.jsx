import { formatDate } from 'lib/datetime';
import { TbMinusVertical } from 'react-icons/tb';
import { FcClock, FcCalendar } from 'react-icons/fc';

const MetadataPost = ({ author, date, readingTime }) => {
  return (
    <div className="pt-3 prose-hr:mt-4 prose-hr:mb-4 md:prose-hr:mt-4 md:prose-hr:mb-4">
      <div className="text-sm md:text-base flex justify-between">
        <div>
          {date && author && (
            <div className="flex">
              <time className="flex items-center" pubdate="pubdate" dateTime={date}>
                <FcCalendar className="text-xl" />
                &nbsp;{formatDate(date)} <TbMinusVertical />
              </time>
              <span>By {author.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <FcClock className="text-xl" />
          &nbsp;
          {readingTime} min read
        </div>
      </div>
      <hr />
    </div>
  );
};

export default MetadataPost;
