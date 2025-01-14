import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerDetails from "./CustomerDetails";
import ShippingAddressDetails from "./ShippingAddressDetails";
import { useGetMeQuery } from "../../../redux/api/auth";
import { Order, OrderProduct } from "../../../redux/types";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerProfile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (queryParams.has("success")) {
      toast.success("Order Payment Successful!");

      // Remove the 'success' query parameter from the URL
      queryParams.delete("success");
      navigate(`${location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
    }

    if (queryParams.has("cancel")) {
      toast.error("Order Payment Failed!");

      // Remove the 'cancel' query parameter from the URL
      queryParams.delete("cancel");
      navigate(`${location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
    }
  }, [queryParams, navigate, location]);

  const { data: user, isLoading, error } = useGetMeQuery();

  // Function to handle payment redirection
  const handlePayNow = (orderId: number) => {
    navigate(`/order-payment?order=${orderId}`);
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
        <div className="w-full md:w-1/3">
          <CustomerDetails
            email={user?.email || ""}
            dateJoined={new Date(user?.created_at || "").toDateString()}
            fullName={user?.name || ""}
          />
        </div>
        <div className="w-full mt-6 md:w-2/3 md:mt-0">
          <ShippingAddressDetails shippingAddress={user?.shipping_address} />
        </div>
      </div>

      {/* Loading or Error State */}
      {isLoading ? (
        <h2 className="text-lg font-medium text-center text-gray-500">
          Loading...
        </h2>
      ) : error ? (
        <h2 className="text-lg font-medium text-center text-red-500">
          {typeof error === "object" && "status" in error
            ? `Error: ${error.status} - ${JSON.stringify(error.data)}`
            : "An unknown error occurred"}
        </h2>
      ) : user.orders?.length <= 0 ? (
        <h2 className="mt-10 text-lg font-medium text-center text-gray-500">
          No Orders Found
        </h2>
      ) : (
        <div className="space-y-8">
          {user.orders?.map((order: Order) => (
            <div
              key={order.order_number}
              className="p-6 rounded-lg shadow-md bg-gray-50"
            >
              {/* Order Details */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {order.order_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Placed</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(order.created_at).toDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-medium text-gray-900">
                    ${order.total_price}
                  </p>
                </div>
              </div>

              {/* Order Status and Payment Method */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium text-gray-900">
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Payment Method:{" "}
                  <span className="font-medium text-gray-900">
                    {order.payment_method}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Payment Status:{" "}
                  <span
                    className={`font-medium ${
                      order.payment_status === "paid"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </p>
              </div>

              {/* Products in the Order */}
              <div className="space-y-4">
                {order.products?.map((product: OrderProduct) => (
                  <div
                    key={product.id}
                    className="flex items-center p-4 bg-white border rounded-lg shadow-sm"
                  >
                    <img
                      src={`http://localhost:8000/${product.images[0]}`}
                      alt={product.name}
                      className="object-cover w-24 h-24 mr-4 rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pay Now Button for Unpaid Orders */}
              <div className="flex justify-end mt-6">
                {order.payment_status === "unpaid" && (
                  <button
                    onClick={() => handlePayNow(order.id)}
                    className="px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 hover:scale-105"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
