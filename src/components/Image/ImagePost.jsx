import Image from 'next/image';

const ImagePost = ({ children, width, height, src, alt, srcSet, dangerouslySetInnerHTML }) => {
  return (
    <figure className="!mt-4">
      <div>
        <Image
          className="rounded-lg"
          placeholder="blur"
          blurDataURL={src}
          width={width || '780'}
          height={height || '490'}
          src={src}
          alt={alt || ''}
          srcSet={srcSet}
          loading="eager"
          layout="intrinsic"
        />
      </div>
      {children && <figcaption>{children}</figcaption>}
      {dangerouslySetInnerHTML && (
        <figcaption
          dangerouslySetInnerHTML={{
            __html: dangerouslySetInnerHTML,
          }}
        />
      )}
    </figure>
  );
};

export default ImagePost;
