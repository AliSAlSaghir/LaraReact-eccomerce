import { Link } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import React, { useEffect, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useLazyGetProductsQuery,
} from "../../../redux/api/products";
import { toast } from "react-toastify";
import { Product } from "../../../redux/types";

const ManageStocks: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const length = useRef<number>(0);

  const [getProducts, { isLoading }] = useLazyGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    let isMounted = true; // Flag to check if component is still mounted

    const fetchProducts = async () => {
      try {
        const { data } = await getProducts(`?page=${page}`);
        if (isMounted) {
          setProducts(prev => [...prev, ...(data?.data || [])]);
          length.current = data?.meta.total ?? 0;
          setShowMore(!!data?.links?.next);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [getProducts, page]);

  // delete product handler
  const deleteProductHandler = async (id: number) => {
    try {
      await deleteProduct(id); // Delete product
      setProducts(prev => prev.filter(product => product.id !== id));
      length.current--;
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Product List- [{length.current}]{" "}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all the products in your system,
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/add-product"
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-20">
          <LoadingComponent />
        </div>
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
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Qty
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Sold
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        QTY Left
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* loop here */}
                    {products?.map(product => (
                      <tr key={product.id}>
                        <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="w-10 h-10 rounded-full"
                                src={`http://localhost:8000/${product?.images[0]}`}
                                alt={product?.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-gray-500">
                                {product?.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="text-gray-900">
                            {product?.category}
                          </div>
                          {/* <div className="text-gray-500">
                            {product.department}
                          </div> */}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product?.quantity === 0 ? (
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product?.total_qty}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product?.total_sold}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product?.quantity}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product?.price}
                        </td>
                        {/* edit */}
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>

                            <span className="sr-only">, {product.name}</span>
                          </Link>
                        </td>
                        {/* delete */}
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => deleteProductHandler(product.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>

                            <span className="sr-only">, {product.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showMore && (
                <div
                  onClick={() => setPage(prev => prev + 1)}
                  className="flex justify-center mt-3 text-indigo-600 cursor-pointer hover:text-indigo-900"
                >
                  Show More...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStocks;
