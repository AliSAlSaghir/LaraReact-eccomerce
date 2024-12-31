import { ChangeEvent, FormEvent, useState } from "react";
import { useGetMeQuery } from "../../../redux/api/auth";
import { ShippingAddress } from "../../../redux/types";
import { useCreateShippingAddressMutation } from "../../../redux/api/shippingAddress";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import { countries } from "countries-list"; // Correct import
import Select from "react-select";

const AddShippingAddress = () => {
  //user profile
  const { data: user, refetch } = useGetMeQuery();

  const [createShippingAddress] = useCreateShippingAddressMutation();

  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    country: "",
    province: "",
    postal_code: "",
    phone: "",
  });

  const countryOptions = Object.entries(countries).map(([code, details]) => ({
    value: details.name,
    label: details.name,
  }));

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption: any) => {
    setFormData({ ...formData, country: selectedOption?.value || "" });
  };

  //onsubmit
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createShippingAddress(formData).unwrap();
      toast.success("Shipping address created successfully!");
      // Optionally reset formData
      setFormData({
        first_name: "",
        last_name: "",
        address: "",
        city: "",
        country: "",
        province: "",
        postal_code: "",
        phone: "",
      });
      refetch();
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(err);
      toast.error(
        err?.data?.message ||
          "Failed to create shipping address. Please try again."
      );
    }
  };

  return (
    <>
      {/* Shipping details */}
      {user?.shipping_address_id !== null ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Shipping Details
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Double-check your information:
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              <strong>First Name:</strong> {user?.shipping_address?.first_name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Last Name:</strong> {user?.shipping_address?.last_name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Address:</strong> {user?.shipping_address?.address}
            </p>
            <p className="text-sm text-gray-700">
              <strong>City:</strong> {user?.shipping_address?.city}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Country:</strong> {user?.shipping_address?.country}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {user?.shipping_address?.phone}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleOnSubmit}
          className="grid grid-cols-1 mt-6 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
        >
          {[
            {
              label: "First name",
              name: "first_name",
              value: formData.first_name,
            },
            {
              label: "Last name",
              name: "last_name",
              value: formData.last_name,
            },
            {
              label: "Address",
              name: "address",
              value: formData.address,
              fullWidth: true,
            },
            { label: "City", name: "city", value: formData.city },
            {
              label: "State / Province",
              name: "province",
              value: formData.province,
            },
            {
              label: "Postal code",
              name: "postal_code",
              value: formData.postal_code,
            },
            {
              label: "Phone",
              name: "phone",
              value: formData.phone,
              fullWidth: true,
            },
          ].map((field, index) => (
            <div key={index} className={field.fullWidth ? "sm:col-span-2" : ""}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <div className="mt-1">
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={handleOnChange}
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={handleOnChange}
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              </div>
            </div>
          ))}
          {/* Country Select */}
          <div className="sm:col-span-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <div className="mt-1">
              <Select
                id="country"
                name="country"
                options={countryOptions}
                value={countryOptions.find(
                  option => option.value === formData.country
                )}
                onChange={handleCountryChange}
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Shipping Address
          </button>
        </form>
      )}
    </>
  );
};

export default AddShippingAddress;
