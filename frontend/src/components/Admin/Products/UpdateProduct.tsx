import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import LoadingComponent from "../../LoadingComp/LoadingComponent";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../../redux/api/products";
import { useNavigate, ErrorResponse, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetBrandsQuery } from "../../../redux/api/brands";
import { useGetCategoriesQuery } from "../../../redux/api/categories";
import { useGetColorsQuery } from "../../../redux/api/colors";
import { useGetSizesQuery } from "../../../redux/api/sizes";
import { Product } from "../../../redux/types";
import { Options } from "./AddProduct";

//animated components for react-select
const animatedComponents = makeAnimated();

export default function UpdateProduct() {
  //form data
  const { id } = useParams<{ id: string }>();
  const { data: { data: product } = {}, error: productError } =
    useGetProductQuery(id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    size_id: [],
    category_id: 0,
    brand_id: 0,
    color_id: [],
    images: [],
    price: "",
    quantity: 0,
    description: "",
  });

  // Update `formData` once `product` is available
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        size_id: product.size_id,
        category_id: product.category_id,
        brand_id: product.brand_id,
        color_id: product.color_id,
        images: product.images,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
      });
    }
  }, [product]);

  const [colorOptions, setColorOptions] = useState<Options[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Options[]>([]);

  const { data: categories, error: categoriesError } = useGetCategoriesQuery();
  const { data: brands, error: brandsError } = useGetBrandsQuery();
  const { data: colorData, error: colorsError } = useGetColorsQuery();
  const { data: sizeData, error: sizesError } = useGetSizesQuery();

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const navigate = useNavigate();
  useEffect(() => {
    setColorOptions(() =>
      colorData?.map(color => {
        return { label: color.name, value: color.id };
      })
    );
    setSizeOptions(() =>
      sizeData?.map(size => {
        return { label: size.name, value: size.id };
      })
    );
  }, [colorData, sizeData]);

  const error =
    categoriesError || brandsError || colorsError || sizesError || productError;
  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  //onChange
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (selectedOptions: Options[] | null) => {
    setFormData({
      ...formData,
      color_id: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
    });
  };

  const handleSizeChange = (selectedOptions: Options[] | null) => {
    setFormData({
      ...formData,
      size_id: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const validFiles = Array.from(files).filter(
        file =>
          ["image/png", "image/jpeg", "image/gif"].includes(file.type) &&
          file.size <= 10 * 1024 * 1024
      );

      if (validFiles.length !== files.length) {
        toast.error(
          "Invalid files: Only PNG, JPG, GIF under 10MB are allowed."
        );
      }

      setFormData({ ...formData, images: validFiles });
    }
  };

  //onSubmit
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("_method", "PUT");
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("brand_id", String(formData.brand_id || ""));
    formDataToSend.append("category_id", String(formData.category_id || ""));
    formDataToSend.append("price", String(formData.price || ""));
    formDataToSend.append("quantity", String(formData.quantity || 0));

    formData.color_id?.forEach((colorId, index) => {
      formDataToSend.append(`color_id[${index}]`, String(colorId));
    });

    formData.size_id?.forEach((sizeId, index) => {
      formDataToSend.append(`size_id[${index}]`, String(sizeId));
    });

    // Append images
    formData.images?.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image);
    });

    try {
      await updateProduct({
        updatedProduct: formDataToSend as any,
        id,
      }).unwrap();

      toast.success("Product updated successfully");
      navigate("/admin/manage-products");
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
            Update Product
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            <Link
              to="/admin/manage-products"
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Manage Products
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleOnChange}
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* size option */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <Select
                  components={animatedComponents}
                  isMulti
                  name="color_id"
                  options={colorOptions}
                  value={colorOptions?.filter(option =>
                    formData.color_id.includes(option.value)
                  )}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={handleColorChange}
                />
              </div>
              {/* Select category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleOnChange}
                  className="block w-full py-2 pl-3 pr-10 mt-1 text-base border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {/* <option>-- Select Category --</option>
                  <option value="Clothings">Clothings</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option> */}
                  <option>-- Select Category --</option>
                  {categories?.map(category => (
                    <option key={category?.id} value={category?.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Brand
                </label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleOnChange}
                  className="block w-full py-2 pl-3 pr-10 mt-1 text-base border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option>-- Select Brand --</option>
                  {brands?.map(brand => (
                    <option key={brand?.id} value={brand?.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Color
                </label>
                <Select
                  components={animatedComponents}
                  isMulti
                  name="size_id"
                  options={sizeOptions}
                  value={sizeOptions?.filter(option =>
                    formData.size_id.includes(option.value)
                  )}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={handleSizeChange}
                />
              </div>

              {/* upload images */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Upload Images
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex justify-center max-w-lg px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400"
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
                          className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload files</span>
                          <input
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            type="file"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="mt-1">
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Quantity
                </label>
                <div className="mt-1">
                  <input
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Product Description
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleOnChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                {isLoading ? (
                  <LoadingComponent />
                ) : (
                  <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Update Product
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
