import EstonianDonationBox from "../elements/estonian-donation-box";

const EstonianHero = ({ data }) => {
  return (
    <section
      id="hero"
      className="mb-80 text-white lg:mb-0"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(17, 94, 89, 0.8), rgba(17, 94, 89, 0.8))",
          `url(${data.background.url})`,
        ],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container pt-40 pb-40 lg:pb-0">
        <div className="flex flex-col items-center space-x-0 space-y-20 lg:space-y-0 lg:space-x-20 lg:flex-row lg:items-start">
          <div className="py-0 w-full text-center lg:py-40 lg:w-3/5 lg:text-left">
            <h1 className="mb-8 text-5xl font-bold leading-tight">
              {data.title}
            </h1>
            <p className="text-2xl leading-normal">{data.subtitle}</p>
          </div>
          <div className="flex relative mx-auto w-full lg:w-2/5 sm:w-2/3">
            <EstonianDonationBox data={data.donationBox} />
          </div>
        </div>
      </div>
      <svg
        className="mt-32 lg:mt-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 508 63"
      >
        <path
          fill="#ffffff"
          d="M 1.4999998e-6,31.75 C 1.4999998e-6,31.75 83.757733,58.208333 127,58.208333 c 86.48454,0 167.51546,-52.9166664 254,-52.9166664 43.24227,0 127,26.4583334 127,26.4583334 V 63.5 H 1.4999998e-6 Z"
          data-darkreader-inline-fill=""
        ></path>
      </svg>
    </section>
  );
};

export default EstonianHero;
