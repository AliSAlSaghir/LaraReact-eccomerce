import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../../redux/api/products";

const policies = [
  {
    name: "International delivery",
    icon: GlobeAmericasIcon,
    description: "Get your order in 2 weeks",
  },
  {
    name: "Loyalty rewards",
    icon: CurrencyDollarIcon,
    description: "Don't look at other fees",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { id } = useParams<{ id: string }>();
  const { data: { data: product } = {}, error } = useGetProductQuery(id);

  //Add to cart handler
  const addToCartHandler = item => {};
  let productColor;
  let productSize;
  const cartItems = [];

  return (
    <div className="bg-white">
      <main className="max-w-2xl px-4 pb-16 mx-auto mt-8 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {product?.name}
              </h1>
              <p className="text-xl font-medium text-gray-900">
                ${product?.price}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {product?.total_qty - product?.total_sold > 0 ? (
                <p className="text-sm font-medium text-green-600">In Stock</p>
              ) : (
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
              )}
            </div>

            {/* Reviews */}
            <div className="mt-4">
              <h2 className="sr-only">Reviews</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {product?.reviews?.length > 0
                    ? product?.average_rating.toFixed(1)
                    : 0}
                </p>
                <div className="flex items-center ml-1">
                  {[0, 1, 2, 3, 4].map(rating => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        +product?.average_rating > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="ml-1 text-sm text-gray-300"
                ></div>
                <div className="flex ml-4">
                  <span className="text-sm italic font-medium text-gray-600">
                    from {product?.total_reviews} total reviews
                  </span>
                </div>
              </div>

              {/* Leave a Review */}
              <div className="mt-4">
                <Link to={`/add-review/${product?.id}`}>
                  <h3 className="text-sm font-medium text-blue-600 hover:underline">
                    Leave a review
                  </h3>
                </Link>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4">
              {/* Large Image */}
              <img
                src={`http://localhost:8000/${product?.images[0]}`}
                alt="Primary product image"
                className="object-cover w-full h-auto rounded-lg lg:h-auto"
              />

              {/* Small Images */}
              <div className="flex flex-col gap-2">
                {product?.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8000/${image}`}
                    alt={`Product image ${index + 2}`}
                    className="flex-1 object-cover w-full rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 lg:col-span-5">
            <>
              {/* Color picker */}
              <div>
                <h2 className="text-sm font-medium text-gray-900">Color</h2>
                <div className="flex items-center space-x-3">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                    <div className="flex items-center mt-4 space-x-3">
                      {product?.colors?.map(color => (
                        <RadioGroup.Option
                          key={color}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color}
                          </RadioGroup.Label>
                          <span
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                            className={classNames(
                              "h-8 w-8 border border-black border-opacity-10 rounded-full"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Size picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">Size</h2>
                </div>
                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="mt-2"
                >
                  {/* Choose size */}
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {product?.sizes?.map(size => (
                      <RadioGroup.Option
                        key={size}
                        value={size}
                        className={({ active, checked }) => {
                          return classNames(
                            checked
                              ? "bg-indigo-600 border-transparent  text-white hover:bg-indigo-700"
                              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                            "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer"
                          );
                        }}
                      >
                        <RadioGroup.Label as="span">{size}</RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {/* add to cart */}
              {product?.quantity <= 0 ? (
                <button
                  style={{ cursor: "not-allowed" }}
                  disabled
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium bg-gray-600 border border-transparent rounded-md text-whitefocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              ) : (
                <button
                  onClick={() => addToCartHandler(1)}
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              )}
              {/* proceed to check */}

              {cartItems.length > 0 && (
                <Link
                  to="/shopping-cart"
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-green-800 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Proceed to checkout
                </Link>
              )}
            </>

            {/* Product details */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <div className="mt-4 prose-sm prose text-gray-500">
                {product?.description}
              </div>
            </div>

            {/* Policies */}
            <section aria-labelledby="policies-heading" className="mt-10">
              <h2 id="policies-heading" className="sr-only">
                Our Policies
              </h2>

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {policies.map(policy => (
                  <div
                    key={policy.name}
                    className="p-6 text-center border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <dt>
                      <policy.icon
                        className="flex-shrink-0 w-6 h-6 mx-auto text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="mt-4 text-sm font-medium text-gray-900">
                        {policy.name}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {policy.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Reviews */}
        <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-24">
          <h2
            id="reviews-heading"
            className="text-lg font-medium text-gray-900"
          >
            Recent reviews
          </h2>

          <div className="pb-10 mt-6 space-y-10 border-t border-b border-gray-200 divide-y divide-gray-200">
            {product?.reviews.map(review => (
              <div
                key={review.id}
                className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
              >
                <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                  <div className="flex items-center xl:col-span-1">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map(rating => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            review.rating > rating
                              ? "text-yellow-400"
                              : "text-gray-200",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {review.rating}
                      <span className="sr-only"> out of 5 stars</span>
                    </p>
                  </div>

                  <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {review?.message}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center mt-6 text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                  <p className="font-medium text-gray-900">{review.user_id}</p>
                  <time
                    dateTime={review.created_at}
                    className="pl-4 ml-4 text-gray-500 border-l border-gray-200 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                  >
                    {new Date(review.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
