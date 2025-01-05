import { ErrorResponse, Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../redux/api/categories";
import { toast } from "react-toastify";

const AllCategories = () => {
  const { data: categories, error } = useGetCategoriesQuery();

  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  return (
    <>
      {/* Header Section */}
      <div className="text-white bg-gradient-to-r from-cyan-500 to-cyan-600">
        <div className="px-4 py-12 mx-auto text-center max-w-7xl sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Explore Our Categories
          </h2>
          <p className="mt-4 text-lg sm:text-xl">
            Find the best products tailored just for you.
          </p>
          <p className="mt-6 text-sm sm:text-base">
            Total Categories:{" "}
            <span className="font-semibold">{categories?.length}</span>
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories?.map(category => (
              <Link
                key={category.name}
                to={`/products-filters?category=${category.name}`}
                className="relative block overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md group hover:shadow-lg"
              >
                {/* Image Section */}
                <img
                  src={`http://localhost:8000/storage/${category.image}`}
                  alt={category.name}
                  className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"
                />

                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    Products: {category?.product_count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCategories;
