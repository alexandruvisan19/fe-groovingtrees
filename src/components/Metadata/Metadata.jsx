import { formatDate } from 'lib/datetime';

const Metadata = ({ author, date }) => {
  return (
    <div className="mt-auto w-full">
      <hr />
      <div className="prose flex justify-between p-5 mt-auto">
        {author && <div>By {author.name}</div>}
        {date && (
          <div>
            <time pubdate="pubdate" dateTime={date}>
              {formatDate(date)}
            </time>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metadata;
