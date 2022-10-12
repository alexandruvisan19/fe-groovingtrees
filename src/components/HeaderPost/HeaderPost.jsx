import Container from 'components/Container';

const HeaderPost = ({ children }) => {
  return (
    <header className="mt-8 md:mt-2">
      <Container>{children}</Container>
    </header>
  );
};

export default HeaderPost;
