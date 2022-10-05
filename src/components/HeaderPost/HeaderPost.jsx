import Container from 'components/Container';

const HeaderPost = ({ children }) => {
  return (
    <header className="mt-8">
      <Container>{children}</Container>
    </header>
  );
};

export default HeaderPost;
