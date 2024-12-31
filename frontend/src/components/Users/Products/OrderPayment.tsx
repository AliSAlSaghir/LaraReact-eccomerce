import { FormEvent, useState } from "react";
import { ErrorResponse, useSearchParams } from "react-router-dom";
import {
  useApplyCouponMutation,
  useCreateStripeSessionMutation,
  useGetOrderQuery,
} from "../../../redux/api/orders";
import AddShippingAddress from "../Forms/AddShippingAddress";
import { toast } from "react-toastify";
import { useGetMeQuery } from "../../../redux/api/auth";

function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

export default function OrderPayment() {
  const [searchParams] = useSearchParams();

  // Extract the order ID from the URL
  const id = searchParams.get("order");
  const { data: order } = useGetOrderQuery(id);
  const { data: user } = useGetMeQuery();
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const [createStripeSession, { isLoading: stripeLoading }] =
    useCreateStripeSessionMutation();

  const [couponCode, setCouponCode] = useState<string>("");

  const orderSubmitHandler = async () => {
    try {
      // Validation checks
      if (!user?.shipping_address_id) {
        toast.error("Please add a shipping address before proceeding.");
        return;
      }

      if (order?.payment_status === "paid") {
        toast.error("This order has already been paid.");
        return;
      }

      if (!order?.products || order.products.length === 0) {
        toast.error("Your order is empty. Please add items to your order.");
        return;
      }

      const { url } = await createStripeSession(id).unwrap();
      window.location.href = url;
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(err);
      toast.error(err.data.message || "An unknown error occurred");
    }
  };

  const applyCouponCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await applyCoupon({ id, coupon: couponCode });

      if ("error" in response) {
        const error = response.error;
        if ("data" in error) {
          throw new Error(
            (error.data as { message?: string }).message || "An error occurred"
          );
        } else if ("message" in error) {
          throw new Error(error.message || "An error occurred");
        } else {
          throw new Error("An unknown error occurred");
        }
      }

      // Success
      toast.success("Coupon Code applied");
      setCouponCode("");
    } catch (error) {
      console.error("Caught error:", error);
      const err = error as Error;
      toast.error(err.message || "An unknown error occurred");
    }
  };

  return (
    <div className="bg-gray-50">
      <main className="px-4 pt-16 pb-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div className="pt-10 mt-10 border-t border-gray-200">
                <AddShippingAddress />
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <ul role="list" className="divide-y divide-gray-200">
                  {order?.products.map(product => (
                    <li
                      key={`${product?.id}${product.pivot.color}${product.pivot.size}`}
                      className="flex px-4 py-6 sm:px-6"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={`http://localhost:8000/${product?.images[0]}`}
                          alt={product.name}
                          className="w-20 rounded-md"
                        />
                      </div>

                      <div className="flex flex-col flex-1 ml-6">
                        <p className="text-sm text-gray-500">{product.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.pivot.size && (
                            <span className="text-gray-600">
                              Size: {product.pivot.size}
                            </span>
                          )}
                        </p>
                        <div className="mt-1 text-sm text-gray-500">
                          {isValidColor(product.pivot.color) ? (
                            <div
                              className="w-5 h-5 border border-gray-300 rounded-full"
                              style={{ backgroundColor: product.pivot.color }}
                              title={product.pivot.color}
                            ></div>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md">
                              {product.pivot.color || "Unknown"}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          $ {product?.price} x {product?.pivot.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Coupon Form */}
                <form
                  onSubmit={applyCouponCode}
                  className="px-4 py-6 border-t sm:px-6"
                >
                  <h3 className="text-sm font-medium text-gray-900">
                    Apply a Coupon
                  </h3>
                  <div className="mt-1">
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      type="text"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Coupon Code"
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded shadow-sm hover:bg-green-700"
                  >
                    {isLoading ? "Applying..." : "Apply Coupon"}
                  </button>
                </form>

                <dl className="px-4 py-6 space-y-6 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Taxes</dt>
                    <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <dt className="text-base font-medium">Sub Total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      $ {order?.total_price}
                    </dd>
                  </div>
                </dl>

                <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
                  <button
                    onClick={orderSubmitHandler}
                    className="w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    {stripeLoading
                      ? "Proceeding to Payment..."
                      : `Confirm Payment - ${order?.total_price}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
