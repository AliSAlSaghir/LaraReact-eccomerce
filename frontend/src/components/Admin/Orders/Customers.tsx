import { useGetUsersQuery } from "../../../redux/api/users";

export default function Customers() {
  const { data: users = [], error } = useGetUsersQuery(); // Default to an empty array in case data is undefined

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <h3 className="mt-3 text-lg font-medium leading-6 text-red-600">
          Failed to load customers.
        </h3>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-4 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Users - [{users.length}]
        </h1>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        List of all the users in your system.
      </p>

      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Joined At
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Nb of Orders
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Total Money Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr
                key={user.id}
                className="transition-colors duration-200 hover:bg-gray-50"
              >
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {user.name}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role || "N/A"}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {user.orders_count || 0}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    ${user.total_money_paid || "0.00"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
