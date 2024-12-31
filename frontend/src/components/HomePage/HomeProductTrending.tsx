import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/products";

const HomeProductTrending = () => {
  const { data: productsResponse } = useGetProductsQuery("?page=1");
  const trendingProducts = productsResponse?.data || [];
  return (
    <>
      <section aria-labelledby="trending-heading">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
          <div className="md:flex md:items-center md:justify-between">
            <h2
              id="favorites-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Trending Products
            </h2>
            <a
              href="#"
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
            >
              Shop the collection
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-2 mt-6 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {trendingProducts?.map(product => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="relative mb-10 group"
              >
                <div className="w-full h-56 overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                  <img
                    src={`http://localhost:8000/${product.images[0]}`}
                    alt={product.name}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <span className="absolute inset-0" />
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">${product.price}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-sm md:hidden">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Shop the collection
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeProductTrending;
