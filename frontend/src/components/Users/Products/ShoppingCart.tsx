import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearCart,
  removeProductFromCart,
  updateProductQuantity,
} from "../../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../../redux/api/orders";
import { useNavigate } from "react-router-dom";

function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

export default function ShoppingCart() {
  const cartItems = useAppSelector(state => state.cart.products);
  const dispatch = useAppDispatch();

  const [createOrder] = useCreateOrderMutation();

  const navigate = useNavigate();

  const changeOrderItemQtyHandler = (
    id: string | number,
    qty: number,
    color: string,
    size: string
  ) => {
    dispatch(
      updateProductQuantity({
        id,
        quantity: qty,
        color,
        size,
      })
    );
    toast.warn(
      `Changed quantity for product ID: ${id}, Color: ${color}, Size: ${size} to ${qty}`
    );
  };

  const removeOrderItemHandler = (
    id: string | number,
    color: string,
    size: string
  ) => {
    dispatch(
      removeProductFromCart({
        id,
        color,
        size,
      })
    );

    toast.warn(`Removed product ID: ${id}, Color: ${color}, Size: ${size}`);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, product) =>
        total + product.quantity * Number(product.product.price),
      0
    );
  };

  const createOrderHandler = async () => {
    try {
      const dataToSend = {
        products: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      };

      const order = await createOrder(dataToSend);

      dispatch(clearCart());
      localStorage.removeItem("cart");

      navigate(`/order-payment?order=${order?.data.id}`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 mt-12 lg:grid-cols-12 lg:gap-x-12">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul role="list" className="space-y-4">
              {cartItems?.map(product => (
                <li
                  key={`${product?.id}${product.color}${product.size}`}
                  className="relative flex items-start p-4 border border-gray-200 rounded-lg shadow-sm w-full sm:w-[95%] mx-auto"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeOrderItemHandler(
                        product.id,
                        product.color,
                        product.size
                      )
                    }
                    className="absolute text-gray-500 top-2 right-2 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`http://localhost:8000/${product.product.images[0]}`}
                      alt={product.product.name}
                      className="object-cover object-center w-20 h-20 rounded-md sm:h-32 sm:w-28"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between flex-1 ml-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 sm:text-base">
                        {product.product.name}
                      </h3>
                      <div className="flex items-center mt-2 text-xs sm:text-sm">
                        {isValidColor(product.color) ? (
                          <div
                            className="w-5 h-5 border border-gray-300 rounded-full"
                            style={{
                              backgroundColor: product.color,
                            }}
                            title={product.color}
                          ></div>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md">
                            {product.color || "Unknown"}
                          </span>
                        )}
                        {product.size && (
                          <span className="ml-4 text-gray-600">
                            Size: {product.size}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        ${product.product.price} × {product.quantity}
                      </p>
                    </div>

                    <div className="flex items-center mt-4 space-x-4">
                      {/* Quantity Selector */}
                      <select
                        value={product.quantity}
                        onChange={e =>
                          changeOrderItemQtyHandler(
                            product.id,
                            +e.target.value,
                            product.color,
                            product.size
                          )
                        }
                        className="px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Array.from(
                          {
                            length:
                              product.product.quantity -
                              cartItems
                                ?.filter(
                                  item => item.product.id === product.product.id
                                )
                                ?.reduce((acc, item) => acc + item.quantity, 0),
                          },
                          (_, i) => i + 1
                        ).map(value => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="summary-heading"
            className="mt-8 lg:mt-0 lg:col-span-5"
          >
            <div className="p-6 rounded-lg shadow-sm bg-gray-50">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order Summary
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    $ {calculateTotalPrice().toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">
                    Order Total
                  </dt>
                  <dd className="text-xl font-medium text-gray-900">
                    $ {calculateTotalPrice().toFixed(2)}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                {cartItems?.length <= 0 ? (
                  <button
                    style={{ cursor: "not-allowed" }}
                    disabled
                    className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-gray-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit Order
                  </button>
                ) : (
                  <button
                    onClick={createOrderHandler}
                    className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit Order
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
