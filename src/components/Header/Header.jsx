const Header = ({ children }) => {
  return (
    <header className="bg-autumn-100 relative flex flex-nowrap justify-center md:shadow-sm">
      <div className="text-center">{children}</div>
    </header>
  );
};

export default Header;
