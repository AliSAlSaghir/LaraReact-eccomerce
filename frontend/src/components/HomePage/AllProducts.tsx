import { ErrorResponse, Link } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/products";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: productsResponse, error } = useGetProductsQuery("");
  const products = productsResponse?.data || [];
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
            Explore Our Products
          </h2>
          <p className="mt-4 text-lg sm:text-xl">
            Find the best products tailored just for you.
          </p>
          <p className="mt-6 text-sm sm:text-base">
            Total Products:{" "}
            <span className="font-semibold">{products?.length}</span>
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products?.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="relative block overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md group hover:shadow-lg"
              >
                {/* Image Section */}
                <img
                  src={`http://localhost:8000/${product.images[0]}`}
                  alt={product.name}
                  className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"
                />

                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-bold text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    price: ${product?.price}
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

export default AllProducts;
