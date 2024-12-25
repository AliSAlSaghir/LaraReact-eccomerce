import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { ErrorResponse, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import {
  useGetCouponQuery,
  useUpdateCouponMutation,
} from "../../../redux/api/coupons";
import { Coupon } from "../../../redux/types";
import { toast } from "react-toastify";

export default function UpdateCoupon() {
  const [startDate, setStartDate] = useState<Date | [Date, Date] | null>(
    new Date()
  );
  const [endDate, setEndDate] = useState<Date | [Date, Date] | null>(
    new Date()
  );
  //---Fetch coupon ---
  const { code: id } = useParams<{ code: string }>();
  const { data: coupon, error } = useGetCouponQuery(id);
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    discount: 0,
  });

  // Update `formData` once `coupon` is available
  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
      });
      setStartDate(new Date(coupon.start_date));
      setEndDate(new Date(coupon.end_date));
    }
  }, [coupon]);

  const navigate = useNavigate();

  //onHandleChange---
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //onHandleSubmit---
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        start_date: startDate.toLocaleString(),
        end_date: endDate.toLocaleString(),
        _method: "PUT",
      };
      await updateCoupon({
        updatedCoupon: dataToSend,
        id,
      }).unwrap();
      toast.success("Coupon updated successfully");
      navigate("/admin/manage-coupons");
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message);
    }
  };

  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Update Coupon
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {/* name */}
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="code"
                  value={formData?.code}
                  onChange={handleOnChange}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {/* discount */}
                Discount (in %)
              </label>
              <div className="mt-1">
                <input
                  name="discount"
                  value={formData?.discount}
                  onChange={handleOnChange}
                  min={1}
                  max={100}
                  type="number"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* start date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <DatePicker
                  selected={Array.isArray(startDate) ? startDate[0] : startDate}
                  onChange={(date: [Date, Date] | Date) => {
                    setStartDate(date);
                  }}
                />
              </div>
            </div>

            {/* end date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <DatePicker
                  selected={Array.isArray(endDate) ? endDate[0] : endDate}
                  onChange={(date: [Date, Date] | Date) => {
                    setEndDate(date);
                  }}
                />
              </div>
            </div>
            <div>
              {isLoading ? (
                <LoadingComponent />
              ) : (
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Coupon
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
