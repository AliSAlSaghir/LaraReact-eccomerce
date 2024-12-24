import { CalendarIcon } from "@heroicons/react/20/solid";

interface Props {
  email: string;
  dateJoined: string;
  fullName: string;
}

export default function CustomerDetails({
  email,
  dateJoined,
  fullName,
}: Props) {
  return (
    <div className="h-64 max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg md:mr-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-indigo-600">
          Welcome, <span className="text-gray-900">{fullName}</span>!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          We're delighted to have you on board.
        </p>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-6">
        {/* Email Section */}
        <div className="flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-3 text-blue-500"
          >
            <path
              strokeLinecap="round"
              d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
            />
          </svg>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm">{email}</p>
          </div>
        </div>

        {/* Date Joined Section */}
        <div className="flex items-center text-gray-700">
          <CalendarIcon className="w-6 h-6 mr-3 text-green-500" />
          <div>
            <p className="text-sm font-medium">Date Joined</p>
            <p className="text-sm">{dateJoined}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
