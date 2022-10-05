import { formatDate } from 'lib/datetime';

const MetadataPost = ({ author, date }) => {
  return (
    <div className="text-base text-trees5-200 text-center">
      {date && author && (
        <time pubdate="pubdate" dateTime={date}>
          Published on {formatDate(date)} 🌱 By {author.name}
        </time>
      )}
    </div>
  );
};

export default MetadataPost;
