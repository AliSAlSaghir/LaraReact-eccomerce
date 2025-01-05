import { Link } from "react-router-dom";
import HomeCategories from "./HomeCategories";
import HomeProductTrending from "./HomeProductTrending";

const offers = [
  {
    name: "Download the app",
    description: "Get an exclusive $5 off code",
    href: "#",
  },
  {
    name: "Return when you're ready",
    description: "60 days of free returns",
    href: "#",
  },
  {
    name: "Sign up for our newsletter",
    description: "15% off your first order",
    href: "#",
  },
];

const perks = [
  {
    name: "Free returns",
    imageUrl:
      "https://shippingchimp.com/blog/wp-content/uploads/2020/08/10_5_eCommerce-Brands-That-Have-Steal-Worthy-Return-Policies.png",
    description:
      "Not what you expected? Place it back in the parcel and attach the pre-paid postage stamp.",
  },
  {
    name: "Same day delivery",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMsb9kw4e5QycN_MBNNE3NIhshPHl783rMmw&s",
    description:
      "We offer a delivery service that has never been done before. Checkout today and receive your products within hours.",
  },
  {
    name: "All year discount",
    imageUrl:
      "https://www.agenciaeplus.com.br/wp-content/uploads/2021/05/codigos-promocionais.jpg",
    description:
      'Looking for a deal? You can use the code "ALLYEAR" at checkout and get money off all year round.',
  },
  {
    name: "For the planet",
    imageUrl:
      "https://burstcommerce.com/guides/e-commerce-sustainability/images/featured.png",
    description:
      "We’ve pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];
export default function Example() {
  return (
    <div className="bg-white">
      <main>
        {/* Hero */}
        <div className="flex flex-col border-b border-gray-200 lg:border-0">
          <nav aria-label="Offers" className="order-last lg:order-first">
            <div className="mx-auto max-w-7xl lg:px-8">
              <ul
                role="list"
                className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-y-0 lg:divide-x"
              >
                {offers.map(offer => (
                  <li
                    key={offer.name}
                    className="flex flex-col transition-all duration-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <a
                      href={offer.href}
                      className="relative flex flex-col justify-center flex-1 px-4 py-6 text-center focus:z-10"
                    >
                      <p className="text-sm text-gray-600">{offer.name}</p>
                      <p className="font-semibold text-gray-900">
                        {offer.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute hidden w-1/2 h-full bg-gradient-to-r from-gray-100 to-gray-200 lg:block"
            />
            <div className="relative bg-gray-100 lg:bg-transparent">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
                <div className="max-w-2xl py-24 mx-auto lg:max-w-none lg:py-64">
                  <div className="lg:pr-16">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Shop with confidence
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                      New products are added every week. Check back often to see
                    </p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className="inline-block px-8 py-3 font-medium text-white transition duration-300 bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                      >
                        Shop Productivity
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-48 sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
              <img
                src="https://files.oaiusercontent.com/file-2a3apYuQRFTSE8CLvaLFqs?se=2025-01-03T18%3A53%3A07Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D9b08dd7d-e769-43b2-bf29-3ac5595ab2f1.webp&sig=LQ/qwZrxUY9bp2Nmuuy9SXwXsTWADgV/nJoZx5Z5Da0%3D"
                alt=""
                className="object-cover object-center w-full h-full rounded-l-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Sale Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
          <section
            aria-labelledby="sale-heading"
            className="relative px-6 py-32 mx-auto text-center max-w-7xl lg:px-8"
          >
            <h2
              id="sale-heading"
              className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl"
            >
              Get 25% off during our one-time sale
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Most of our products are limited releases that won't come back.
              Get your favorite items while they're in stock.
            </p>
            <a
              href="#"
              className="inline-block px-8 py-3 mt-6 text-lg font-medium text-white transition duration-300 bg-black rounded-md shadow-lg hover:bg-gray-800 hover:shadow-xl"
            >
              Get access to our one-time sale
            </a>
          </section>
        </div>

        {/* Category Section */}
        <section
          aria-labelledby="category-heading"
          className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8"
        >
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="category-heading"
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Shop by Category
            </h2>
            <Link
              to="/all-categories"
              className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
            >
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          <HomeCategories />
        </section>

        {/* Trending Products */}
        <HomeProductTrending />

        {/* Perks Section */}
        <section
          aria-labelledby="perks-heading"
          className="border-t border-gray-200 bg-gray-50"
        >
          <h2 id="perks-heading" className="sr-only">
            Our perks
          </h2>
          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map(perk => (
                <div
                  key={perk.name}
                  className="p-6 text-center transition transform bg-white rounded-lg shadow-md hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    className="w-auto h-24 mx-auto mb-4"
                    src={perk.imageUrl}
                    alt={perk.name}
                  />
                  <h3 className="text-lg font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
