import { ErrorResponse, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../../redux/api/categories";

const HomeCategories = () => {
  const { data: categories, error } = useGetCategoriesQuery();

  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  const categoriesToShow = categories?.slice(0, 5) || [];

  return (
    <>
      <div className="flow-root mt-4">
        <div className="-my-2">
          <div className="box-content relative py-2 overflow-x-auto h-80 xl:overflow-visible">
            <div className="absolute flex px-4 space-x-8 min-w-screen-xl sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
              {categoriesToShow?.map(category => (
                <Link
                  key={category.name}
                  to={`/products-filters?category=${category.name}`}
                  className="relative flex flex-col w-56 p-6 overflow-hidden transition-transform duration-300 rounded-lg shadow-md h-80 hover:shadow-lg hover:scale-105 xl:w-auto"
                >
                  {/* Background Image */}
                  <span aria-hidden="true" className="absolute inset-0">
                    <img
                      src={`http://localhost:8000/storage/${category.image}`}
                      alt={category.name}
                      className="object-cover object-center w-full h-full rounded-lg"
                    />
                  </span>

                  {/* Gradient Overlay */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-gray-900 to-transparent opacity-70"
                  />

                  {/* Category Name */}
                  <span className="relative mt-auto text-xl font-semibold text-center text-white">
                    {category.name}
                  </span>

                  {/* Product Count */}
                  <span className="relative text-sm font-medium text-center text-gray-300">
                    Products: {category.product_count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCategories;
