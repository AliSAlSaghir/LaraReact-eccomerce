import { FC, Fragment, SVGProps, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, Outlet } from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../../redux/hooks";

interface Link {
  name: string;
  href: string;
  icon: (() => JSX.Element) | FC<SVGProps<SVGSVGElement>>;
  current?: boolean;
}
const ordersLinks: Link[] = [
  {
    name: "Dashboard",
    href: "",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
    current: true,
  },
  {
    name: "Manage Orders",
    href: "manage-orders",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    name: "Users",
    href: "customers",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
];

const productsLinks: Link[] = [
  {
    name: "Add Product",
    href: "add-product",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
    current: false,
  },

  {
    name: "Manage Stock",
    href: "manage-products",
    icon: ScaleIcon,
    current: false,
  },
];

const couponsLinks: Link[] = [
  {
    name: "Add Coupon",
    href: "add-coupon",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    ),
  },
  {
    name: "Manage Coupon",
    href: "manage-coupons",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7.5l3 4.5m0 0l3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const AttributesLinks: Link[] = [
  { name: "Add Attribute", href: "add-attribute", icon: CogIcon },
  {
    name: "All Attributes",
    href: "all-attributes",
    icon: QuestionMarkCircleIcon,
  },
];
function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { userInfo } = useAppSelector(state => state.auth);

  return (
    <>
      <div className="min-h-full">
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
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
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-cyan-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex items-center flex-shrink-0 px-4"></div>
                  <nav
                    className="flex flex-col flex-1 mt-5 overflow-y-auto divide-y divide-cyan-800"
                    aria-label="Sidebar"
                  >
                    {/* Orders Links Mobile */}
                    <div className="pt-1 mt-1">
                      <div className="px-2 space-y-1">
                        {ordersLinks.map(item => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                          >
                            <item.icon
                              className="w-6 h-6 mr-4 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Products Links Mobile */}
                    <div className="px-2 mt-8 space-y-1">
                      {productsLinks.map(item => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-cyan-800 text-white"
                              : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                            "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md transition-colors duration-200"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          <item.icon
                            className="flex-shrink-0 w-6 h-6 mr-4 text-cyan-200"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    {/* Coupons Links Mobile */}
                    <div className="pt-6 mt-6">
                      <div className="px-2 space-y-1">
                        {couponsLinks.map(item => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                          >
                            <item.icon
                              className="w-6 h-6 mr-4 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Categories Links Mobile */}
                    <div className="pt-3 mt-3">
                      <div className="px-2 space-y-1">
                        {AttributesLinks.map(item => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                          >
                            <item.icon
                              className="w-6 h-6 mr-4 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static Sidebar for Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-cyan-900">
            <nav
              className="flex flex-col flex-1 mt-5 overflow-y-auto divide-y divide-cyan-800"
              aria-label="Sidebar"
            >
              {/* Orders Links Desktop */}
              <div className="pt-1 mt-16">
                <div className="px-2 space-y-1">
                  {ordersLinks.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                    >
                      <item.icon
                        className="w-6 h-6 mr-4 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Products Links Desktop */}
              <div className="px-2 mt-8 space-y-1">
                {productsLinks.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-cyan-800 text-white"
                        : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                      "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md transition-colors duration-200"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className="flex-shrink-0 w-6 h-6 mr-4 text-cyan-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              {/* Coupons Links Desktop */}
              <div className="pt-6 mt-6">
                <div className="px-2 space-y-1">
                  {couponsLinks.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                    >
                      <item.icon
                        className="w-6 h-6 mr-4 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Categories Links Desktop */}
              <div className="pt-3 mt-3">
                <div className="px-2 space-y-1">
                  {AttributesLinks.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-2 py-2 text-sm font-medium leading-6 transition-colors duration-200 rounded-md group text-cyan-100 hover:bg-cyan-600 hover:text-white"
                    >
                      <item.icon
                        className="w-6 h-6 mr-4 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 lg:pl-64">
          {/* Top Bar */}
          <div className="flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:border-none">
            <button
              type="button"
              className="px-4 text-gray-400 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Page Header */}
          <main className="flex-1 pb-8">
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="flex-1 min-w-0">
                    {/* Profile */}
                    <div className="flex items-center">
                      <img
                        className="hidden w-16 h-16 mt-2 rounded-full sm:block"
                        src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG.png"
                        alt={userInfo.name}
                      />
                      <div>
                        <div className="flex items-center">
                          <img
                            className="w-16 h-16 rounded-full sm:hidden"
                            src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG.png"
                            alt={userInfo.name}
                          />
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                            Good morning, {userInfo.name}
                          </h1>
                        </div>
                        <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                          <dd className="flex items-center text-sm font-medium text-gray-500 capitalize sm:mr-6">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              ></path>
                            </svg>
                            Role: Admin
                          </dd>
                          <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0">
                            <svg
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            Date Joined:{" "}
                            {new Date(userInfo.created_at).toLocaleDateString()}
                          </dd>
                          <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 sm:mr-6 sm:mt-0">
                            <svg
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              ></path>
                            </svg>
                            {userInfo.email}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
