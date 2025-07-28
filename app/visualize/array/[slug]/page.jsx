
export default async function DynamicPage({ params }) {
  const slug = params.slug;

  console.log(slug);

  // api call

  const pageData = {
    "bubble-sort": "bubble-sort.jsx",
    "binary-search": "binary-search.jsx",
    "insertion-sort": "insertion-sort.jsx",
    "merge-sort": "merge-sort.jsx",
    "quick-sort": "quick-sort.jsx",
    "selection-sort": "selection-sort.jsx",
  };

  const pageName = pageData[slug];

  console.log(pageName);
  
  try {
    const componentModule = await import(`Pages/array/${pageName}`);
    const Component = componentModule.default;

    if (!Component)
      return (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
          <p className="text-gray-500">This algorithm page does not exist.</p>
        </div>
      );

    return <Component />;
  } catch (error) {
    console.error("Error loading component:", error);
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
        <p className="text-gray-500">This algorithm page does not exist.</p>
      </div>
    );
  }
}
