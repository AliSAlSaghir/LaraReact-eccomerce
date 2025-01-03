import { Link } from "react-router-dom";

const Products = ({ products }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
        {products?.map(product => (
          <div
            key={product?.id}
            className="w-full overflow-hidden transition duration-300 ease-in-out transform bg-white rounded-lg shadow-lg group hover:scale-105"
          >
            <div className="relative bg-gray-50">
              {/* Discount Badge */}
              <span className="absolute top-0 left-0 px-2 py-1 mt-6 ml-6 text-xs font-bold text-white bg-red-500 border-2 border-red-500 rounded-full">
                -15%
              </span>

              {/* Product Image */}
              <Link
                className="block"
                to={{
                  pathname: `/products/${product?.id}`,
                }}
              >
                <img
                  className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                  src={`http://localhost:8000/${product?.images[0]}`}
                  alt={product?.name}
                />
              </Link>

              {/* Product Info */}
              <div className="px-6 pb-6 mt-8">
                <a className="block px-6 mb-2" href="#">
                  <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    {product?.name}
                  </h3>

                  {/* Price */}
                  <p className="text-lg font-bold text-blue-500">
                    <span className="text-lg font-semibold">
                      ${product?.price}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 line-through">
                      ${(product?.price * 1.15).toFixed(2)}{" "}
                      {/* Calculating 15% increase */}
                    </span>
                  </p>
                </a>

                {/* Add to Cart Button */}
                <a
                  className="flex items-center justify-center w-12 h-12 ml-auto mr-2 text-white transition-all duration-300 ease-in-out bg-blue-500 rounded-md hover:bg-blue-600"
                  href="#"
                >
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x={5} width={2} height={12} fill="white" />
                    <rect
                      x={12}
                      y={5}
                      width={2}
                      height={12}
                      transform="rotate(90 12 5)"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;
