import { useGetOrderStatsQuery } from "../../../redux/api/orders";

export default function OrdersStats() {
  const { data: orderStats } = useGetOrderStatsQuery();

  const stats = [
    {
      title: "Sales Today",
      value: `$${orderStats?.saleToday}`,
      color: "bg-yellow-500",
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Min Order",
      value: `$${orderStats?.orders?.minimumSale}`,
      color: "bg-red-500",
      icon: (
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
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      ),
    },
    {
      title: "Max Order",
      value: `$${orderStats?.orders?.maxSale}`,
      color: "bg-blue-500",
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: "Total Income",
      value: `$${orderStats?.orders?.totalSales}`,
      color: "bg-green-500",
      icon: (
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative px-6 py-8 overflow-hidden rounded-lg shadow-lg ${stat.color} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            {/* Icon */}
            <div className="absolute p-3 text-gray-800 bg-white rounded-md shadow-md">
              {stat.icon}
            </div>

            {/* Title */}
            <dt>
              <p className="ml-16 text-sm font-medium tracking-wider uppercase">
                {stat.title}
              </p>
            </dt>

            {/* Value */}
            <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
              <p className="text-3xl font-bold">{stat.value || 0}</p>
            </dd>

            {/* Footer Link */}
            <div className="absolute inset-x-0 bottom-0 px-4 py-4 bg-white bg-opacity-20 backdrop-blur-sm">
              <a
                href="#"
                className="text-sm font-medium text-gray-200 transition-colors duration-300 hover:text-white"
              >
                View all
              </a>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
