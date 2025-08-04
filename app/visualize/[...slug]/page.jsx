export default async function DynamicPage({ params }) {
  const slug = params.slug;

  const pageData = {
    "bubble-sort": "bubble-sort.jsx",
    "binary-search": "binary-search.jsx",
    "insertion-sort": "insertion-sort.jsx",
    "merge-sort": "merge-sort.jsx",
    "quick-sort": "quick-sort.jsx",
    "selection-sort": "selection-sort.jsx",
    "create": "create.jsx",
    "insert-node": "insert-node.jsx",
    "delete-node": "delete-node.jsx",
    "basic-stack":"basic-stack.jsx",
    "basic-queue":"basic-queue.jsx"
  };

  let type = "";
  let algorithm = "";

  if (slug[0] == "array") {
    type = "array";
    algorithm = slug[1] ? pageData[slug[1]] : "front-page.jsx";
  } else if (slug[0] == "linked-list") {
    type = "linked-list";
    algorithm = slug[1] ? pageData[slug[1]] : "front-page.jsx";
  } else if (slug[0] == "stack-queue") {
    type = "stack-queue";
    algorithm = slug[1] ? pageData[slug[1]] : "front-page.jsx";
  }

  console.log(`data coming from url ${type} ${algorithm}`);

  try {
    const componentModule = await import(`Pages/${type}/${algorithm}`);
    const Component = componentModule.default;

    if (!Component)
      return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">
            🚧 {type?.toUpperCase()} Visualizer
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-white">
            This feature is under construction and will be available soon.
          </p>
        </div>
      );

    return <Component name={"Sachin"} surname={"sadiwal"} />;
  } catch (error) {
    console.error("Error loading component:", error);
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">
          🚧 {type?.toUpperCase()} Visualizer
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-white">
          This feature is under construction and will be available soon.
        </p>
      </div>
    );
  }
}
