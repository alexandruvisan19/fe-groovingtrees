import { formatDate } from 'lib/datetime';
import { TbMinusVertical } from 'react-icons/tb';
import { FcClock, FcCalendar } from 'react-icons/fc';

const MetadataPost = ({ author, date, readingTime }) => {
  return (
    <div className="text-sm md:text-base flex justify-between">
      <div>
        {date && author && (
          <div className="flex">
            <time className="flex items-center" pubdate="pubdate" dateTime={date}>
              <FcCalendar /> &nbsp; {formatDate(date)} <TbMinusVertical className="text-lg" />
            </time>
            <span>By {author.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <FcClock /> &nbsp;
        {readingTime} min read
      </div>
    </div>
  );
};

export default MetadataPost;
