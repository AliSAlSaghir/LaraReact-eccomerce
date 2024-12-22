import { Link } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import {
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from "../../../redux/api/brands";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../redux/api/categories";
import {
  useDeleteColorMutation,
  useGetColorsQuery,
  useUpdateColorMutation,
} from "../../../redux/api/colors";
import {
  useDeleteSizeMutation,
  useGetSizesQuery,
  useUpdateSizeMutation,
} from "../../../redux/api/sizes";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function ManageAttributes() {
  // Fetch data from all queries
  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useGetCategoriesQuery();
  const {
    data: brands,
    isLoading: loadingBrands,
    error: errorBrands,
  } = useGetBrandsQuery();
  const {
    data: sizes,
    isLoading: loadingSizes,
    error: errorSizes,
  } = useGetSizesQuery();
  const {
    data: colors,
    isLoading: loadingColors,
    error: errorColors,
  } = useGetColorsQuery();

  const [deleteCategory, { isLoading: deleteCategoryLoading }] =
    useDeleteCategoryMutation();
  const [deleteBrand, { isLoading: deleteBrandLoading }] =
    useDeleteBrandMutation();
  const [deleteColor, { isLoading: deleteColorLoading }] =
    useDeleteColorMutation();
  const [deleteSize, { isLoading: deleteSizeLoading }] =
    useDeleteSizeMutation();

  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();
  const [updateBrand, { isLoading: updateBrandLoading }] =
    useUpdateBrandMutation();
  const [updateColor, { isLoading: updateColorLoading }] =
    useUpdateColorMutation();
  const [updateSize, { isLoading: updateSizeLoading }] =
    useUpdateSizeMutation();

  const allData = [
    ...(categories?.map(item => ({ ...item, type: "category" })) || []),
    ...(brands?.map(item => ({ ...item, type: "brand" })) || []),
    ...(sizes?.map(item => ({ ...item, type: "size" })) || []),
    ...(colors?.map(item => ({ ...item, type: "color" })) || []),
  ];

  // Sort by updatedAt
  const sortedData = allData.sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return dateB.getTime() - dateA.getTime(); // Compare timestamps directly
  });

  // delete handler (you'll need to implement this)
  const deleteHandler = (id: number, type: string) => {
    // Check the type of the entity and call the appropriate delete mutation
    switch (type) {
      case "category":
        deleteCategory(id);
        break;
      case "brand":
        deleteBrand(id);
        break;
      case "color":
        deleteColor(id);
        break;
      case "size":
        deleteSize(id);
        break;
      default:
        console.error("Unknown type:", type);
    }
  };

  const updateHandler = async (id: number, type: string, data: any) => {
    const updatedData = { ...data, _method: "PUT" };
    try {
      switch (type) {
        case "category":
          await updateCategory({ id, updatedCategory: updatedData }).unwrap();
          toast.success("Category updated successfully!");
          break;
        case "brand":
          await updateBrand({ id, updatedBrand: updatedData }).unwrap();
          toast.success("Brand updated successfully!");
          break;
        case "color":
          await updateColor({ id, updatedColor: updatedData }).unwrap();
          toast.success("Color updated successfully!");
          break;
        case "size":
          await updateSize({ id, updatedSize: updatedData }).unwrap();
          toast.success("Size updated successfully!");
          break;
        default:
          console.error("Unknown type:", type);
          break;
      }
    } catch (error) {
      toast.error("Failed to update attribute. Please try again.");
      console.error(error);
    }
  };

  // Check loading states and errors
  const isLoading =
    loadingCategories ||
    loadingBrands ||
    loadingSizes ||
    loadingColors ||
    deleteCategoryLoading ||
    deleteBrandLoading ||
    deleteColorLoading ||
    deleteSizeLoading ||
    updateCategoryLoading ||
    updateBrandLoading ||
    updateColorLoading ||
    updateSizeLoading;
  const isError = errorCategories || errorBrands || errorSizes || errorColors;
  const noData =
    !categories?.length && !brands?.length && !sizes?.length && !colors?.length;

  useEffect(() => {
    if (!isLoading && noData) {
      toast.info("No data Found");
    }
  }, [isLoading, noData]);

  if (isError) toast.error("Error loading the data");

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            All Categories
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all categories, brands, sizes, and colors in your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/add-attribute"
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add New Attribute
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="flex flex-col mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        No. Products
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Modified At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Edit
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full">
                              {item?.type === "category" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 text-blue-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                                    clipRule="evenodd"
                                  />
                                  <path d="m10.076 8.64-2.201-2.2V4.874a.75.75 0 0 0-.364-.643l-3.75-2.25a.75.75 0 0 0-.916.113l-.75.75a.75.75 0 0 0-.113.916l2.25 3.75a.75.75 0 0 0 .643.364h1.564l2.062 2.062 1.575-1.297Z" />
                                  <path
                                    fillRule="evenodd"
                                    d="m12.556 17.329 4.183 4.182a3.375 3.375 0 0 0 4.773-4.773l-3.306-3.305a6.803 6.803 0 0 1-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 0 0-.167.063l-3.086 3.748Zm3.414-1.36a.75.75 0 0 1 1.06 0l1.875 1.876a.75.75 0 1 1-1.06 1.06L15.97 17.03a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {item?.type === "brand" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 text-green-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                                    clipRule="evenodd"
                                  />
                                  <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0 0-2.651L15.5 4.787a1.875 1.875 0 0 0-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375Z" />
                                </svg>
                              )}
                              {item?.type === "color" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 text-red-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5A3.75 3.75 0 0 0 3 17.25a1.5 1.5 0 0 1-1.601 1.497.75.75 0 0 0-.7 1.123 5.25 5.25 0 0 0 9.8-2.62 3.75 3.75 0 0 0-3.75-3.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {item?.type === "size" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 text-purple-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 5.25 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.543 1.872-7.662 1.872 7.662h-3.744Zm-9.756 0L5.25 8.131l-1.872 7.662h3.744Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {item?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item?.type}{" "}
                          {/* Now 'type' will show 'brand', 'color', etc. */}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item?.product_count || 0}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(item?.updated_at).toLocaleString()}
                        </td>
                        {/* Edit icon */}
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <button
                            onClick={() =>
                              updateHandler(item.id, item.type, {
                                name:
                                  prompt("Enter the new name", item.name) ||
                                  item.name,
                              })
                            }
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </td>
                        {/* Delete icon */}
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-left whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => deleteHandler(item?.id, item?.type)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
