import { useGetOrdersQuery } from "../../../redux/api/orders";
import OrdersStats from "./OrdersStatistics";

export default function OrdersList() {
  const { data: orders } = useGetOrdersQuery();

  // Limit orders to 10
  const displayedOrders = orders?.slice(0, 10);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-5 sm:flex sm:items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Orders Overview
        </h2>
      </div>

      {/* Order Stats */}
      <OrdersStats />

      <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900">
        Recent Orders
      </h3>

      <div className="mt-4 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Order Number
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Order Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Delivery Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedOrders?.map(order => (
              <tr key={order?.id}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {order?.order_number}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Payment Method</dt>
                    <dd className="mt-1 text-gray-700 truncate">
                      {order?.payment_method}
                    </dd>
                    <dt className="sr-only sm:hidden">Order Date</dt>
                    <dd className="mt-1 text-gray-500 truncate sm:hidden">
                      {order?.created_at}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {order?.payment_method || "N/A"}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {new Date(order?.created_at).toLocaleDateString() || "N/A"}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {order?.delivered_at
                    ? new Date(order?.delivered_at).toLocaleDateString()
                    : "Not Delivered"}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      order?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order?.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order?.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order?.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order?.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  ${order?.total_price || "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
