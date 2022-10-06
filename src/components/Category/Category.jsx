const DEFAULT_METADATA_OPTIONS = {
  compactCategories: true,
};

const Category = ({ categories, options = DEFAULT_METADATA_OPTIONS }) => {
  const { compactCategories } = options;

  return (
    <>
      {Array.isArray(categories) && categories[0] && (
        <div className="pt-2 pb-1 pr-5 pl-5">
          {compactCategories && (
            <p title={categories.map(({ name }) => name).join(', ')}>
              <span className="bg-autumn-100 pt-1 pb-1 pr-3 pl-3 rounded-2xl font-semibold">#{categories[0].name}</span>
            </p>
          )}
          {!compactCategories && (
            <ul>
              {categories.map((category) => {
                return <li key={category.slug}>{category.name}</li>;
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Category;
