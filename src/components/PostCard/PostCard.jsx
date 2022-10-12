import Image from 'next/image';

import { sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';
import Category from 'components/Category';

const PostCard = ({ post, options = {} }) => {
  const { title, excerpt, date, author, categories, featuredImage } = post;
  const { excludeMetadata = [] } = options;

  const metadata = {};

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  return (
    <>
      {featuredImage && (
        <>
          <div className="rounded-lg overflow-hidden text-center">
            <Image
              placeholder="blur"
              blurDataURL={featuredImage.sourceUrl}
              className="object-cover"
              src={featuredImage.sourceUrl}
              alt={featuredImage.altText}
              width={500}
              height={300}
            />
          </div>
          <Category {...metadata} />
        </>
      )}

      <div className="pt-1 pb-2 pr-5 pl-5">
        <h3
          className=" text-2xl font-bold pb-4 pt-1"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />

        {excerpt && (
          <div
            className=" pb-4"
            dangerouslySetInnerHTML={{
              __html: sanitizeExcerpt(excerpt),
            }}
          />
        )}
      </div>
      <Metadata {...metadata} />
    </>
  );
};

export default PostCard;
