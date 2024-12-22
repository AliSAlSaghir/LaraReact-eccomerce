import { useState } from "react";
import { useAddColorMutation } from "../../../redux/api/colors";
import { useAddBrandMutation } from "../../../redux/api/brands";
import { useAddCategoryMutation } from "../../../redux/api/categories";
import { useAddSizeMutation } from "../../../redux/api/sizes";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddAttributes() {
  const [selectedAttribute, setSelectedAttribute] = useState<
    "Category" | "Brand" | "Color" | "Size"
  >("Category");
  const [name, setName] = useState("");
  const [addColor, { isLoading: colorLoading }] = useAddColorMutation();
  const [addSize, { isLoading: sizeLoading }] = useAddSizeMutation();
  const [addCategory, { isLoading: categoryLoading }] =
    useAddCategoryMutation();
  const [addBrand, { isLoading: brandLoading }] = useAddBrandMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      switch (selectedAttribute) {
        case "Category":
          await addCategory({ name }).unwrap();
          break;
        case "Brand":
          await addBrand({ name }).unwrap();
          break;
        case "Color":
          await addColor({ name }).unwrap();
          break;
        case "Size":
          await addSize({ name }).unwrap();
          break;
      }
      setName("");
      toast.success(`${selectedAttribute} added successfully!`);
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message);
    }
  };

  const isLoading =
    colorLoading || sizeLoading || categoryLoading || brandLoading;

  return (
    <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Add {selectedAttribute}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block mb-5 text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1 mb-5">
                <input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? "Loading..." : `Add ${selectedAttribute}`}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-6">
              {["Category", "Brand", "Color", "Size"].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedAttribute(type as any)}
                  className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 ${
                    selectedAttribute === type
                      ? "bg-indigo-100 text-indigo-700 font-bold"
                      : ""
                  }`}
                >
                  Add {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
