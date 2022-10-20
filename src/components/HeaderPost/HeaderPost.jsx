import Container from 'components/Container';

const HeaderPost = ({ children }) => {
  return (
    <header className="mt-4 md:mt-2 prose-md md:prose-lg">
      <Container>{children}</Container>
    </header>
  );
};

export default HeaderPost;
