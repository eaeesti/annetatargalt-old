import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { fetchAPI } from "utils/api";
import { formatEstonianNumber } from "utils/estonia";

const DonationCounter = ({ data }) => {
  let [currentTotal, setCurrentTotal] = useState(0);
  let [totalDonations, setTotalDonations] = useState(0);

  function round(number, decimalPlaces) {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
  }

  function countToTotal() {
    if (currentTotal !== totalDonations) {
      // Start fast, end slow
      const toAdd =
        Math.max(1 - currentTotal / totalDonations, 0.01) ** 1.2 *
        (totalDonations / 10);
      setCurrentTotal(round(Math.min(currentTotal + toAdd, totalDonations), 2));
    }
  }

  async function fetchTotalDonations() {
    try {
      const response = await fetchAPI("/totaldonations");
      if (response.success) {
        setTotalDonations(response.total);
      }
    } catch (err) {}
  }

  function startCountingToTotalWhenOnScreen() {
    const counterText = document.getElementById("counterText");
    if (!counterText) return; // weird
    const counterTextRect = counterText.getBoundingClientRect();
    if (counterTextRect.top < window.innerHeight) {
      document.removeEventListener("scroll", startCountingToTotalWhenOnScreen);
      countToTotal();
    }
  }

  useEffect(() => {
    fetchTotalDonations();
    setInterval(fetchTotalDonations, 10000);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", startCountingToTotalWhenOnScreen);
    startCountingToTotalWhenOnScreen();
  }, [totalDonations]);

  useEffect(() => {
    setTimeout(countToTotal, 10);
  }, [currentTotal]);

  return (
    <div className="text-gray-600 bg-white">
      <div
        id="counter"
        className="container flex flex-col py-40 space-y-10 text-center"
      >
        <div
          id="counterText"
          className="flex flex-col items-center m-auto text-2xl lg:flex-row lg:items-end"
        >
          {data.textBefore && <span> {data.textBefore}</span>}
          <span className="block mx-0 my-5 text-5xl font-bold tracking-tight lg:mx-3 lg:my-0 text-primary-700">
            {formatEstonianNumber(currentTotal.toFixed(2))}
            {data.currency}
          </span>
          {data.textAfter && <span> {data.textAfter}</span>}
        </div>
        {data.bottomText && (
          <div className="max-w-full text-gray-600 prose prose-2xl">
            <Markdown>{data.bottomText}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCounter;
