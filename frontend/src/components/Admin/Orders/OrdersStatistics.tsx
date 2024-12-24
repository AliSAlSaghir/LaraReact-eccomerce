import { useGetOrderStatsQuery } from "../../../redux/api/orders";

export default function OrdersStats() {
  const { data: orderStats } = useGetOrderStatsQuery();

  const stats = [
    {
      title: "Orders Pending",
      value: orderStats?.statusCounts?.pending,
      color: "bg-yellow-500",
    },
    {
      title: "Orders Cancelled",
      value: orderStats?.statusCounts?.cancelled,
      color: "bg-red-500",
    },
    {
      title: "Orders Processing",
      value: orderStats?.statusCounts?.processing,
      color: "bg-blue-500",
    },
    {
      title: "Total Income",
      value: orderStats?.orders?.totalSales,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="mt-5">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative px-6 py-8 overflow-hidden rounded-lg shadow-lg ${stat.color} text-white`}
          >
            <dt>
              <div className="absolute p-3 text-gray-800 bg-white rounded-md shadow-md">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  ></path>
                </svg>
              </div>
              <p className="ml-16 text-sm font-medium">{stat.title}</p>
            </dt>
            <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
              <p className="text-3xl font-bold">{stat.value || 0}</p>
              <div className="absolute inset-x-0 bottom-0 px-4 py-4 bg-white bg-opacity-20">
                <a
                  href="#"
                  className="text-sm font-medium text-gray-200 hover:text-gray-50"
                >
                  View all
                </a>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
