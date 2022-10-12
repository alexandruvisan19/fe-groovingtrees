import { formatDate } from 'lib/datetime';
import { TbMinusVertical } from 'react-icons/tb';

const MetadataPost = ({ author, date }) => {
  return (
    <div className="text-sm uppercase">
      {date && author && (
        <time className="flex items-center" pubdate="pubdate" dateTime={date}>
          Published on {formatDate(date)} <TbMinusVertical className="text-lg" /> By {author.name}
        </time>
      )}
    </div>
  );
};

export default MetadataPost;
