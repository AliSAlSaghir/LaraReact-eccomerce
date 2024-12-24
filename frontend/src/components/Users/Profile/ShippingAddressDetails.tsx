import { ShippingAddress } from "../../../redux/types";

// Define the component with typed props
interface ShippingAddressDetailsProps {
  shippingAddress: ShippingAddress | null; // shippingAddress can be null
}

export default function ShippingAddressDetails({
  shippingAddress,
}: ShippingAddressDetailsProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="h-56 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
        <img
          className="object-cover w-full h-full"
          src="https://images.pexels.com/photos/6348105/pexels-photo-6348105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Shipping illustration"
        />
      </div>
      <div className="relative px-6 py-12 mx-auto max-w-7xl sm:px-8 lg:px-12 lg:py-16">
        <div className="md:ml-auto md:w-1/2 md:pl-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Shipping Address Details
          </h2>
          <div className="mt-6 space-y-4">
            <p className="text-lg text-gray-700">
              <strong>Full Name:</strong> {shippingAddress?.first_name}{" "}
              {shippingAddress?.last_name || "Not Provided"}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Address:</strong>{" "}
              {shippingAddress?.address || "Not Provided"}
            </p>
            <p className="text-lg text-gray-700">
              <strong>City:</strong> {shippingAddress?.city || "Not Provided"}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Country:</strong>{" "}
              {shippingAddress?.country || "Not Provided"}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Phone:</strong> {shippingAddress?.phone || "Not Provided"}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Postal Code:</strong>{" "}
              {shippingAddress?.postal_code || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
