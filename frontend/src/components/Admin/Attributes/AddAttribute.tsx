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
  const [image, setImage] = useState<File | null>(null); // Change from array to single File
  const [addColor, { isLoading: colorLoading }] = useAddColorMutation();
  const [addSize, { isLoading: sizeLoading }] = useAddSizeMutation();
  const [addCategory, { isLoading: categoryLoading }] =
    useAddCategoryMutation();
  const [addBrand, { isLoading: brandLoading }] = useAddBrandMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Set only one file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);

      // Check if there's an image and append it
      if (selectedAttribute === "Category" && image) {
        formData.append("image", image); // Only append the first image
      }

      console.log([...formData.entries()]);

      // Send the form data using the fetch API or a library like axios
      switch (selectedAttribute) {
        case "Category":
          await addCategory(formData as any).unwrap();
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

      // Reset state after submission
      setName("");
      setImage([]);
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

            {/* Conditional rendering of image upload for Category */}
            {selectedAttribute === "Category" && (
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="flex justify-center max-w-lg px-6 pt-5 pb-6 transition-all duration-200 ease-in-out border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                  <div className="space-y-2 text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-500 transition-transform transform hover:scale-105"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <input
                          name="image"
                          onChange={handleFileChange}
                          type="file"
                          accept="image/*"
                          id="file-upload" // Make sure the ID is correct to match the label's `htmlFor`
                          className="hidden"
                        />
                        <span>Upload an image</span>
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}
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
