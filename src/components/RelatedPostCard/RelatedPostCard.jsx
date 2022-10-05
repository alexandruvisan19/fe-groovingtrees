import Link from 'next/link';

import { postPathBySlug } from 'lib/posts';

import Image from 'next/image';

const PostCard = ({ post, options = {} }) => {
  const { title, slug, categories, image } = post;
  const { excludeMetadata = [] } = options;
  const metadata = {};

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  return (
    <div>
      {image && (
        <div>
          <Link href={postPathBySlug(slug)}>
            <a aria-label={title}>
              <Image src={image} alt={title} width={475} height={250} />
            </a>
          </Link>
        </div>
      )}
      <div>
        <Link href={postPathBySlug(slug)}>
          <a>
            <span
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
