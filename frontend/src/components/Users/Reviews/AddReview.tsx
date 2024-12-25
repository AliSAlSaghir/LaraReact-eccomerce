import { ChangeEvent, FormEvent, useState } from "react";
import { Review } from "../../../redux/types";
import { ErrorResponse, useNavigate, useParams } from "react-router-dom";
import {
  useAddReviewMutation,
  useGetProductQuery,
} from "../../../redux/api/products";
import { toast } from "react-toastify";

export default function AddReview() {
  //---form data---

  const [formData, setFormData] = useState<Partial<Review>>({
    rating: 1,
    message: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: { data: product } = {} } = useGetProductQuery(id);
  const [addReview, { error }] = useAddReviewMutation();
  //onChange
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onSubmit
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addReview({ id, newReview: formData }).unwrap();
      toast.success("Review added successfully");
      navigate(-1);
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message || err.data.error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
            Add Your Review
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              You are reviewing:{" "}
              <span className="font-semibold text-gray-900">
                {product?.name}{" "}
              </span>
            </span>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={handleOnChange}
                  name="rating"
                  className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {/* review rating */}

                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 </option>
                </select>
              </div>

              {/* description */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleOnChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add New Review
                </button>
              </div>

              <div>
                <div
                  onClick={() => navigate(-1)}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  I have Changed my mind
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
