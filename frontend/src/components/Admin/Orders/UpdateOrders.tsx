import { ChangeEvent, useState } from "react";
import { useUpdateOrdersStatusMutation } from "../../../redux/api/orders";
import { toast } from "react-toastify";

const UpdateOrders = ({ id }: { id: number }) => {
  const [status, setStatus] = useState("pending");
  const [previousStatus, setPreviousStatus] = useState("pending"); // Track the previous status

  const [updateOrderStatus] = useUpdateOrdersStatusMutation();

  const onChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    // Update the status immediately to avoid UI reverting
    setStatus(newStatus);

    // Check if the status is the same as the previous status
    if (newStatus === previousStatus) return;

    try {
      await updateOrderStatus({ status: newStatus, id });
      setPreviousStatus(newStatus); // Update the previous status on success
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message || "An error occurred while updating the status"
      );
    }
  };

  return (
    <div className="flex justify-end pt-4 mt-6 sm:mt-0 sm:pt-0 sm:ml-auto">
      <div className="flex items-center space-x-4 text-sm font-medium border-t border-gray-200 divide-x divide-gray-200 sm:mt-0 sm:border-none">
        <div className="w-full max-w-xs">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Update Order Status
          </label>
          <select
            id="status"
            name="status"
            onChange={onChange}
            value={status}
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrders;
