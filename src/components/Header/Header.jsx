const Header = ({ children }) => {
  return (
    <header className="relative flex flex-nowrap justify-center md:p-4">
      <div className="text-center">{children}</div>
    </header>
  );
};

export default Header;
