import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/products";

const HomeProductTrending = () => {
  const { data: productsResponse } = useGetProductsQuery("?page=1");
  const products = productsResponse?.data || [];

  // Logic to determine trending products (e.g., based on `total_sold`)
  const trendingProducts = [...products]
    .sort((a, b) => (b?.total_sold || 0) - (a?.total_sold || 0))
    .slice(0, 4);

  return (
    <>
      <section aria-labelledby="trending-heading">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <h2
              id="favorites-heading"
              className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Trending Products
            </h2>
            <Link
              to="/products"
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
            >
              View all products
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 mt-8 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {trendingProducts.map(product => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="relative group"
              >
                {/* Image */}
                <div className="w-full h-56 overflow-hidden bg-gray-200 rounded-lg group-hover:opacity-80 lg:h-72 xl:h-80">
                  <img
                    src={`http://localhost:8000/${product.images[0]}`}
                    alt={product.name}
                    className="object-cover object-center w-full h-full"
                  />
                </div>

                {/* Info */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {product.description}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer Link (Mobile) */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all products
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeProductTrending;
