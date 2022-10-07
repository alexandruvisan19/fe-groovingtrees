import Image from 'next/image';

const ImagePost = ({ children, width = '1200', height = '630', src, alt, srcSet, dangerouslySetInnerHTML }) => {
  return (
    <figure className="!mt-4">
      <div>
        <Image
          className="rounded-lg"
          width={width}
          height={height}
          src={src}
          alt={alt || ''}
          srcSet={srcSet}
          layout="intrinsic"
          priority
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
