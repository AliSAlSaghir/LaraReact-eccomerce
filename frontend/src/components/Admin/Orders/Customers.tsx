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
        <h1 className="text-xl font-semibold text-gray-900">
          Users - [{users.length}]
        </h1>
      </div>
      <p className="mt-1 text-sm text-gray-700 ">
        List of all the users in your system,
      </p>

      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
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
              <tr key={user.id}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {user.name}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {user.role || "N/A"}
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
                  {user.orders_count || 0}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  ${user.total_money_paid || "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
