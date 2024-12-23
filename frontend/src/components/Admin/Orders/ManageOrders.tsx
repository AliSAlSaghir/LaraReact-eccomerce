import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  EnvelopeIcon,
  RocketLaunchIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import UpdateOrders from "./UpdateOrders";
import { useGetOrdersQuery } from "../../../redux/api/orders";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

export default function ManageOrders() {
  // Get orders
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  return (
    <div className="bg-gray-50">
      <main className="py-20">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="max-w-2xl px-4 mx-auto lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Manage Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and discover
              similar products.
            </p>
          </div>
        </div>

        <section aria-labelledby="recent-heading" className="mt-16">
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {isLoading ? (
                <h2>Loading...</h2>
              ) : (
                orders?.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border"
                  >
                    {/* Order Level Details */}
                    <div className="flex flex-col p-6 space-y-4 border-b border-gray-200 sm:flex-row sm:space-y-0 sm:space-x-6 sm:p-6">
                      <dl className="grid flex-1 grid-cols-2 text-sm gap-x-6 sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                        <div>
                          <dt className="font-medium text-gray-900">
                            Order number
                          </dt>
                          <dd className="mt-1 text-gray-500">
                            {order?.order_number}
                          </dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">
                            Date placed
                          </dt>
                          <dd className="mt-1 text-gray-500">
                            <time dateTime={order.created_at}>
                              {new Date(order.created_at).toLocaleDateString()}
                            </time>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Total amount
                          </dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            $ {order.total_price}
                          </dd>
                        </div>
                      </dl>

                      <div>
                        <dt className="font-medium text-gray-900">
                          Payment Method
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          {order?.payment_method}
                        </dd>
                      </div>
                    </div>

                    {/* Order Status and Payment Status */}
                    <div className="px-6 py-4 space-y-4 sm:px-8 sm:py-6">
                      {/* Status Section */}
                      <div className="flex items-center space-x-2">
                        {order.status === "pending" ? (
                          <CheckCircleIcon
                            className="w-5 h-5 text-yellow-500"
                            aria-hidden="true"
                          />
                        ) : order.status === "processing" ? (
                          <EllipsisHorizontalCircleIcon
                            className="w-5 h-5 text-blue-500"
                            aria-hidden="true"
                          />
                        ) : order.status === "shipped" ? (
                          <RocketLaunchIcon
                            className="w-5 h-5 text-purple-500"
                            aria-hidden="true"
                          />
                        ) : order.status === "delivered" ? (
                          <CheckCircleIcon
                            className="w-5 h-5 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircleIcon
                            className="w-5 h-5 text-red-500"
                            aria-hidden="true"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-500">
                          Status:{" "}
                          <span className="font-semibold">{order.status}</span>
                        </p>
                      </div>
                      {/* Payment Status Section */}
                      <div className="flex items-center space-x-2">
                        {order.payment_status === "paid" ? (
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        )}
                        <p className="text-sm font-medium text-gray-500">
                          Payment Status:{" "}
                          <span className="font-semibold">
                            {order.payment_status}
                          </span>
                        </p>
                      </div>

                      {/* Flex container to align the UpdateOrders button to the right */}
                      <div className="flex items-center justify-between pt-4 mt-6 space-x-4 text-sm font-medium border-t border-gray-200 divide-x divide-gray-200 sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                        {/* Left part: Status and Payment Status */}
                        <div className="flex-1"></div>

                        {/* Right part: Update Order */}
                        <div className="ml-auto mt-[-5rem]">
                          <UpdateOrders id={order?.id} />
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <ul role="list" className="divide-y divide-gray-200">
                      {order?.products?.map(product => (
                        <li key={product?.id} className="p-4 sm:p-6">
                          <div className="flex items-center sm:items-start">
                            <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-200 rounded-lg sm:h-40 sm:w-40">
                              <img
                                src={`http://localhost:8000/${product?.images[0]}`}
                                alt={product?.name}
                                className="object-cover object-center w-full h-full"
                              />
                            </div>
                            <div className="flex-1 ml-6 text-sm">
                              <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                <h5>{product.name}</h5>
                                <p className="mt-2 sm:mt-0">
                                  ${product?.pivot.price}
                                </p>
                              </div>
                              <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                {product?.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
