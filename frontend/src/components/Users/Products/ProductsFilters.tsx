import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Transition,
  RadioGroup,
} from "@headlessui/react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Products from "./Products";
import { useGetBrandsQuery } from "../../../redux/api/brands";
import { useGetColorsQuery } from "../../../redux/api/colors";
import { useGetSizesQuery } from "../../../redux/api/sizes";
import { ErrorResponse, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLazyGetProductsQuery } from "../../../redux/api/products";
import { Color } from "../../../redux/types";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const prices = [
  {
    amount: "0 - 25",
  },
  {
    amount: "25 - 50",
  },
  {
    amount: "50 - 75",
  },
  {
    amount: "75 - 100",
  },
  {
    amount: "100 - 150",
  },
  {
    amount: "150 - 200",
  },
  {
    amount: "200 - 250",
  },
  {
    amount: "250 - 300",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const isValidColor = color => {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
};

export default function ProductsFilters() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [color, setColor] = useState<Partial<Color>>({});
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const [products, setProducts] = useState([]);

  const { data: brands, error: brandsError } = useGetBrandsQuery();
  const {
    data: colors,
    error: colorsError,
    isLoading: colorsLoading,
  } = useGetColorsQuery();
  const { data: sizes, error: sizesError } = useGetSizesQuery();

  const [getProducts, { isLoading }] = useLazyGetProductsQuery();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Construct query parameters
        const params = new URLSearchParams();

        params.append("category", category);
        if (color) params.append("colors", color?.name || "");
        if (size) params.append("sizes", size);
        if (brand) params.append("brand", brand);
        if (price) params.append("price", price);

        const queryString = params.toString();

        // Fetch data with query parameters
        const { data } = await getProducts(`?${queryString}`);
        setProducts(data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };
    fetchProducts();
  }, [brand, category, color, getProducts, price, size]);

  const error = brandsError || colorsError || sizesError;
  if (error) {
    const err = error as ErrorResponse;
    console.error(err);
    toast.error(err.data?.message || "An error occurred while fetching data");
  }

  return (
    <div className="bg-white">
      <div>
        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {/*  */}
                    <Disclosure
                      as="div"
                      className="px-4 py-6 border-t border-gray-200"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Choose Color
                              </span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {!open && setColor("")}
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {/* Any Color */}
                              {colorsLoading ? (
                                <h2>Loading...</h2>
                              ) : (
                                <RadioGroup onChange={setColor}>
                                  <div className="flex flex-row flex-wrap items-start">
                                    {colors?.map(color => (
                                      <RadioGroup.Option
                                        key={color?.id}
                                        value={color}
                                        className={({ active, checked }) =>
                                          classNames(
                                            active && checked
                                              ? "ring-2 ring-offset-1 ring-blue-500"
                                              : "",
                                            !active && checked
                                              ? "ring-2 ring-blue-500"
                                              : "",
                                            "relative rounded-full flex flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                          )
                                        }
                                      >
                                        {isValidColor(color?.name) ? (
                                          <span
                                            style={{
                                              backgroundColor: color?.name,
                                            }}
                                            aria-hidden="true"
                                            className="w-8 h-8 border border-black rounded-full border-opacity-10"
                                          />
                                        ) : (
                                          <span className="px-2 py-1 text-sm font-medium text-gray-900 uppercase border border-black rounded-full border-opacity-10">
                                            {color?.name}
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    ))}
                                  </div>
                                </RadioGroup>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    {/* price categories section */}
                    <Disclosure
                      as="div"
                      className="px-4 py-6 border-t border-gray-200"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Price
                              </span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {!open && setPrice("")}
                          <Disclosure.Panel className="pt-6">
                            <div className="mt-2 space-y-6">
                              {prices?.map(price => (
                                <div
                                  key={price.amount}
                                  className="flex items-center"
                                >
                                  <input
                                    onClick={() => setPrice(price?.amount)}
                                    name="price"
                                    type="radio"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:ring-indigo-500"
                                  />
                                  <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                    $ {price?.amount}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end price categories section  */}

                    {/* product brand categories section categories section */}
                    <Disclosure
                      as="div"
                      className="px-4 py-6 border-t border-gray-200"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Brand
                              </span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {!open && setBrand("")}
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-2">
                              {brands?.map(brand => (
                                <div
                                  key={brand?.id}
                                  className="flex items-center"
                                >
                                  <input
                                    onClick={() => setBrand(brand?.name)}
                                    name="brand"
                                    type="radio"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                    {brand?.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end product brand categories section */}

                    {/* product size categories   */}
                    <Disclosure
                      as="div"
                      className="px-4 py-6 border-t border-gray-200"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Size
                              </span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {!open && setSize("")}
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {sizes?.map(size => (
                                <div
                                  key={size.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="radio"
                                    name="size"
                                    onClick={() => setSize(size.name)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                    {size.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end product size categories section */}
                  </form>
                  {/* end of mobile filters */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between pt-24 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Product Filters
            </h1>
            {/* sort */}
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                {/* sort item links */}
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions?.map(option => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop  Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>

                {/* colors categories Desktop section */}
                <Disclosure
                  as="div"
                  className="px-4 py-6 border-t border-gray-200"
                >
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -mx-2 -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Color
                          </span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      {!open && setColor("")}
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6">
                          {/* Any Color */}
                          {colorsLoading ? (
                            <h2>Loading...</h2>
                          ) : (
                            <RadioGroup onChange={setColor}>
                              <div className="flex flex-row flex-wrap items-start">
                                {colors?.map(color => (
                                  <RadioGroup.Option
                                    key={color?.id}
                                    value={color}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring-2 ring-offset-1 ring-blue-500"
                                          : "",
                                        !active && checked
                                          ? "ring-2 ring-blue-500"
                                          : "",
                                        "relative rounded-full flex flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                      )
                                    }
                                  >
                                    {isValidColor(color?.name) ? (
                                      <span
                                        style={{
                                          backgroundColor: color?.name,
                                        }}
                                        aria-hidden="true"
                                        className="w-8 h-8 border border-black rounded-full border-opacity-10"
                                      />
                                    ) : (
                                      <span className="px-2 py-1 text-sm font-medium text-gray-900 uppercase border border-black rounded-full border-opacity-10">
                                        {color?.name}
                                      </span>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/* colors end categories section */}

                {/* price categories section Desktop*/}
                <Disclosure
                  as="div"
                  className="px-4 py-6 border-t border-gray-200"
                >
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -mx-2 -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Price
                          </span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      {!open && setPrice("")}
                      <Disclosure.Panel className="pt-6">
                        <div className="mt-2 space-y-6">
                          {prices?.map(price => (
                            <div
                              className="flex items-center"
                              key={price.amount}
                            >
                              <input
                                onClick={() => setPrice(price?.amount)}
                                name="price"
                                type="radio"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:ring-indigo-500"
                              />
                              <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                $ {price?.amount}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end price categories section  Desktop*/}

                {/* product brand categories section categories section */}
                <Disclosure
                  as="div"
                  className="px-4 py-6 border-t border-gray-200"
                >
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -mx-2 -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Brand
                          </span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      {!open && setBrand("")}
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-2">
                          {brands?.map(brand => (
                            <div key={brand?.id} className="flex items-center">
                              <input
                                onClick={() => setBrand(brand?.name)}
                                name="brand"
                                type="radio"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                {brand?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product brand categories section */}

                {/* product size categories  desktop */}
                <Disclosure
                  as="div"
                  className="px-4 py-6 border-t border-gray-200"
                >
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -mx-2 -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Size
                          </span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      {!open && setSize("")}
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6">
                          {sizes?.map(size => (
                            <div key={size?.id} className="flex items-center">
                              <input
                                type="radio"
                                name="size"
                                onClick={() => setSize(size.name)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label className="flex-1 min-w-0 ml-3 text-gray-500">
                                {size.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product size categories section */}
              </form>

              {/* Product grid */}
              {isLoading ? (
                <h2 className="text-xl">Loading...</h2>
              ) : (
                <Products products={products} />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
