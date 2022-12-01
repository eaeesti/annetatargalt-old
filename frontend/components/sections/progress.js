import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { fetchAPI } from "utils/api";
import { formatEstonianNumber } from "utils/estonia";

const Progress = ({ data }) => {
  let [decemberTotal, setDecemberTotal] = useState(0);
  let [currentTotal, setCurrentTotal] = useState(0);
  let [totalDonations, setTotalDonations] = useState(0);
  let [goal, setGoal] = useState(0);

  function round(number, decimalPlaces) {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
  }

  function countToTotal() {
    if (currentTotal !== decemberTotal) {
      // Start fast, end slow
      const toAdd =
        Math.max(1 - currentTotal / decemberTotal, 0.02) ** 1.3 *
        (decemberTotal / 10);
      setCurrentTotal(round(Math.min(currentTotal + toAdd, decemberTotal), 2));
    }
  }

  function getPercentage() {
    return (currentTotal / goal) * 100;
  }

  function calculateGoal(amount) {
    setGoal(data.goals.find((goal) => goal > amount));
  }

  async function fetchTotalDonations() {
    try {
      const response = await fetchAPI("/totaldonations");
      if (response.success) {
        setDecemberTotal(response.christmas2022);
        setTotalDonations(response.total);
        calculateGoal(response.christmas2022);
      }
    } catch (err) {}
  }

  function startProgressBarWhenOnScreen() {
    const progressText = document.getElementById("progressText");
    const progressTextRect = progressText.getBoundingClientRect();
    if (progressTextRect.top < window.innerHeight) {
      document.removeEventListener("scroll", startProgressBarWhenOnScreen);
      countToTotal();
    }
  }

  useEffect(() => {
    fetchTotalDonations();
    setInterval(fetchTotalDonations, 10000);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", startProgressBarWhenOnScreen);
    startProgressBarWhenOnScreen();
  }, [decemberTotal]);

  useEffect(() => {
    setTimeout(countToTotal, 10);
  }, [currentTotal]);

  return (
    <div className="bg-white text-slate-600">
      <div
        id="progress"
        className="container flex flex-col py-40 space-y-12 text-center"
      >
        <div className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl text-primary-700">
          {data.title}
        </div>
        <div id="progressText" className="text-xl">
          <span className="block text-5xl font-bold whitespace-nowrap text-primary-700 md:inline">
            {formatEstonianNumber(Math.floor(currentTotal))}
            {data.currency}
          </span>{" "}
          {data.outOf}{" "}
          <span className="font-bold whitespace-nowrap">
            {formatEstonianNumber(Math.floor(goal))}
            {data.currency}
          </span>{" "}
          {data.donated}
        </div>
        <div className="overflow-hidden w-full rounded-lg bg-slate-300">
          {getPercentage() ? (
            <div
              id="progressBar"
              className="overflow-hidden text-white lg:text-lg bg-primary-700"
              style={{ width: `${getPercentage()}%` }}
            >
              {getPercentage().toFixed(1)}%
            </div>
          ) : (
            <>&nbsp;</>
          )}
        </div>
        <div className="max-w-full text-slate-600 prose prose-xl">
          {data.totalText}{" "}
          <span className="font-bold whitespace-nowrap text-primary-700">
            {formatEstonianNumber(totalDonations.toFixed(0))}
            {data.currency}
          </span>
          .
        </div>
        {data.bottomText && (
          <div className="max-w-full text-slate-600 prose prose-xl">
            <Markdown>{data.bottomText}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
