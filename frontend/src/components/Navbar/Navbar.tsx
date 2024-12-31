import { Fragment, useMemo, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import logo from "./logo3.png";
import { useGetCategoriesQuery } from "../../redux/api/categories";
import { useAppSelector } from "../../redux/hooks";
import { useGetCouponsQuery } from "../../redux/api/coupons";

const Navbar: React.FC = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: coupons } = useGetCouponsQuery();

  const bestCoupon = useMemo(() => {
    if (!coupons) return null;
    const today = new Date();
    return (
      coupons
        // Filter coupons based on conditions
        .filter(coupon => {
          const startDate = new Date(coupon.start_date);
          const endDate = new Date(coupon.end_date);
          return (
            startDate < today && // Start date is less than today
            endDate > today && // Not expired
            coupon.days_left &&
            parseInt(coupon.days_left, 10) > 0 // Days left is greater than 0
          );
        })
        // Sort by expiration date in descending order
        .sort(
          (a, b) =>
            new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        )[0] // Get the first (largest) coupon
    );
  }, [coupons]);

  const { userInfo } = useAppSelector(state => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  //get cart items from local storage
  const cartItems = useAppSelector(state => state.cart.products);

  return (
    <div className="bg-white">
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
                {/* mobile category menu links */}
                <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                  {/* {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="block p-2 -m-2 font-medium text-gray-900">
                        {page.name}
                      </a>
                    </div>
                  ))} */}

                  {categories?.map(category => {
                    return (
                      <Link
                        key={category?.id} // Add the key here
                        to={`/products-filters?category=${category?.name}`}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {category?.name.toUpperCase()}
                      </Link>
                    );
                  })}
                </div>

                {/* mobile links register/login */}
                {!userInfo && (
                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    <div className="flow-root">
                      <Link
                        to="/register"
                        className="block p-2 -m-2 font-medium text-gray-900"
                      >
                        Create an account
                      </Link>
                    </div>
                    <div className="flow-root">
                      <Link
                        to="/login"
                        className="block p-2 -m-2 font-medium text-gray-900"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                )}

                <div className="px-4 py-6 space-y-6 border-t border-gray-200"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Top navigation  desktop*/}
          {bestCoupon && !bestCoupon?.is_expired && (
            <div className="bg-yellow-600">
              <div className="flex items-center justify-between h-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <p
                  style={{ textAlign: "center", width: "100%" }}
                  className="flex-1 text-sm font-medium text-center text-white lg:flex-none"
                >
                  {bestCoupon
                    ? `${bestCoupon?.code}- ${bestCoupon?.discount}% , ${bestCoupon?.days_left}`
                    : "No Flash Sale at the Moment"}
                </p>

                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6"></div>
              </div>
            </div>
          )}
          {!userInfo && (
            <div className="bg-gray-900">
              <div className="flex items-center justify-between h-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Link
                    to="/register"
                    className="text-sm font-medium text-white hover:text-gray-100"
                  >
                    Create an account
                  </Link>
                  <span className="w-px h-6 bg-gray-600" aria-hidden="true" />
                  <Link
                    to="/login"
                    className="text-sm font-medium text-white hover:text-gray-100"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Deskto Navigation */}
          <div className="bg-white">
            <div className="border-b border-gray-200">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:items-center">
                    <Link to="/">
                      <span className="sr-only">Your Company</span>
                      <img
                        className="w-auto h-32 pt-2"
                        src={logo}
                        alt="i-novotek logo"
                      />
                    </Link>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/*  menus links*/}
                    <Popover.Group className="ml-8">
                      <div className="flex justify-center h-full space-x-8">
                        {categories?.map(category => {
                          return (
                            <Link
                              key={category?.id}
                              to={`/products-filters?category=${category?.name}`}
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                              {category?.name.toUpperCase()}
                            </Link>
                          );
                        })}
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Mobile Naviagtion */}
                  <div className="flex items-center flex-1 lg:hidden">
                    <button
                      type="button"
                      className="p-2 -ml-2 text-gray-400 bg-white rounded-md"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                  {/* logo */}
                  <Link to="/" className="lg:hidden">
                    <img
                      className="w-auto h-32 mt-2"
                      src={logo}
                      alt="i-novotek logo"
                    />
                  </Link>

                  {/* login profile icon mobile */}
                  <div className="flex items-center justify-end flex-1">
                    <div className="flex items-center lg:ml-8">
                      {userInfo && (
                        <div className="flex space-x-8">
                          <div className="flex">
                            <Link
                              to="/customer-profile"
                              className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            >
                              <UserIcon
                                className="w-6 h-6"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      )}

                      <span
                        className="w-px h-6 mx-4 bg-gray-200 lg:mx-6"
                        aria-hidden="true"
                      />
                      {/* login shopping cart mobile */}
                      <div className="flow-root">
                        <Link
                          to="/shopping-cart"
                          className="flex items-center p-2 -m-2 group"
                        >
                          <ShoppingCartIcon
                            className="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            {cartItems?.length > 0 ? cartItems.length : 0}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
