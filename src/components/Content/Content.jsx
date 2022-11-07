const Content = ({ children }) => {
  return (
    <div className="prose-lg prose-p:leading-7 prose-blue hover:prose-a:text-autumn-500 prose-a:transition prose-a:ease-in-out prose-a:delay-250 prose-a:duration-300">
      {children}
    </div>
  );
};

export default Content;
