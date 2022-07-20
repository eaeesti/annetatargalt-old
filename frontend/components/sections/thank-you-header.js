import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchAPI } from "utils/api";
import { string } from "utils/string";
import { currencyUtils } from "utils/currency";
import Markdown from "react-markdown";

const ThankYouHeader = ({ data }) => {
  const router = useRouter();
  let [donation, setDonation] = useState();

  function fbShare(event) {
    event.preventDefault();
    window.open(
      data.facebookShareLink,
      "Share on Facebook",
      "toolbar=0,status=0,width=720,height=500"
    );
  }

  function twitterShare(event) {
    event.preventDefault();
    window.open(
      data.twitterShareLink,
      "Share on Twitter",
      "toolbar=0,status=0,width=720,height=500"
    );
  }

  useEffect(() => {
    async function fetchDonation() {
      let paymentToken = router.query.payment_token;
      if (!paymentToken) {
        const paymentTokenMatches = router.asPath.match(
          new RegExp(`[&?]payment_token=(.*)(&|$)`)
        );
        if (!paymentTokenMatches) {
          if (!donation) {
            router.replace("/");
          }
          return;
        }
        paymentToken = paymentTokenMatches[1];
      }

      try {
        const decodeURL =
          "/decode?" + new URLSearchParams({ payment_token: paymentToken });
        const response = await fetchAPI(decodeURL);
        if (response.success) {
          setDonation(response.donation);
          router.replace(router.asPath.split("?")[0]);
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDonation();
  }, []);

  return (
    <header className="flex flex-col flex-grow justify-center text-center text-white bg-primary-600">
      {donation && (
        <div className="container flex flex-col items-center pt-40 pb-20 space-y-20 md:pt-60 md:pb-40">
          <div className="flex flex-col items-center space-y-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 116.87"
              className="w-32 h-32"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M 42.449219 0 L 31.880859 17.869141 L 11.730469 22.320312 L 13.679688 42.990234 L 0 58.429688 L 13.730469 74.009766 L 11.730469 94.550781 L 32 99.080078 L 42.449219 116.86914 L 61.509766 108.61914 L 80.429688 116.86914 L 91 99 L 111.15039 94.550781 L 109.19922 73.869141 L 122.88086 58.429688 L 109.15039 42.849609 L 111.15039 22.320312 L 90.880859 17.789062 L 80.429688 0 L 61.369141 8.2402344 L 42.449219 0 z M 79.873047 37.443359 C 85.152109 37.698359 89.680156 44.455469 84.910156 49.480469 L 61.669922 77.199219 A 7.13 7.13 0 0 1 51.769531 77.640625 C 47.829531 73.890625 42.049922 68.5 37.919922 65 C 31.849922 58.47 41.169922 48.740391 47.919922 54.900391 C 50.299922 57.070391 53.760156 60.240625 56.160156 62.390625 L 74.660156 39.660156 C 76.270156 37.995156 78.113359 37.358359 79.873047 37.443359 z "
              />
            </svg>
            {data.title && (
              <div className="text-2xl font-bold md:text-4xl sm:text-3xl">
                {string.format(data.title, donation)}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center space-y-8">
            {data.message1 && (
              <div className="m-auto max-w-full text-white prose prose-lg prose-header">
                <Markdown>{string.format(data.message1, donation)}</Markdown>
              </div>
            )}
            {donation.organizations && (
              <div className="p-4 text-lg text-left rounded-2xl bg-primary-700">
                <table>
                  <tbody>
                    {donation.organizations.map((organization) => (
                      <tr key={organization.name}>
                        <td className="p-4 text-right">
                          {Math.round(organization.proportion * 100)}%
                        </td>
                        <td className="p-4 font-bold">{organization.name}</td>
                        <td className="p-4 text-right">
                          {organization.amount.toFixed(2)}
                          {currencyUtils.toSymbol(donation.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex flex-col items-stretch space-y-8">
            {data.message2 && (
              <div className="m-auto max-w-full text-white prose prose-2xl prose-header">
                <Markdown>{string.format(data.message2, donation)}</Markdown>
              </div>
            )}
            <div className="flex flex-col justify-center space-y-4 md:space-x-4 md:flex-row md:space-y-0">
              {data.facebookShareText && data.facebookShareLink && (
                <a
                  href={data.facebookShareLink}
                  target="_blank"
                  onClick={fbShare}
                  rel="noreferrer"
                >
                  <div
                    className="flex flex-row py-3 pl-4 pr-6 space-x-3 text-xl bg-[#4267B2] rounded-xl items-center justify-center hover:opacity-70 transition-opacity select-none"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-7 h-7"
                    >
                      <path
                        fill="currentColor"
                        d="M17.525,9H14V7c0-1.032,0.084-1.682,1.563-1.682h1.868v-3.18C16.522,2.044,15.608,1.998,14.693,2 C11.98,2,10,3.657,10,6.699V9H7v4l3-0.001V22h4v-9.003l3.066-0.001L17.525,9z"
                      ></path>
                    </svg>
                    <div>{data.facebookShareText}</div>
                  </div>
                </a>
              )}
              {data.twitterShareText && data.twitterShareLink && (
                <div>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={data.twitterShareLink}
                    onClick={twitterShare}
                  >
                    <div className="flex flex-row py-3 pl-5 pr-6 space-x-3 text-xl bg-[#1DA1F2] rounded-xl justify-center items-center hover:opacity-70 transition-opacity select-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-6 h-6"
                      >
                        <path
                          fill="currentColor"
                          d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                        />
                      </svg>
                      <div>{data.twitterShareText}</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
          {data.message3 && (
            <div className="m-auto max-w-full text-white prose prose-lg prose-header">
              <Markdown>{string.format(data.message3, donation)}</Markdown>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default ThankYouHeader;
