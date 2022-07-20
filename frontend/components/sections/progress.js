import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { fetchAPI } from "utils/api";

const Progress = ({ data }) => {
  let [decemberTotal, setDecemberTotal] = useState(0);
  let [currentTotal, setCurrentTotal] = useState(0);
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

  function calculateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    const percentage = (currentTotal / goal) * 100 || 0;
    progressBar.innerHTML = percentage.toFixed(1) + "%";
    progressBar.style.width = Math.min(percentage, 100) + "%";
  }

  function calculateGoal(currentTotal) {
    setGoal(
      data.goals.reduce(
        (prev, cur) =>
          cur < currentTotal || (cur > currentTotal && prev < currentTotal)
            ? cur
            : prev,
        data.goals[0]
      )
    );
  }

  async function fetchDecemberTotal() {
    try {
      const response = await fetchAPI("/decembertotal");
      if (response.success) {
        calculateGoal(response.total);
        setDecemberTotal(response.total);
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
    fetchDecemberTotal();
    setInterval(fetchDecemberTotal, 10000);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", startProgressBarWhenOnScreen);
    startProgressBarWhenOnScreen();
  }, [decemberTotal]);

  useEffect(() => {
    setTimeout(countToTotal, 10);
    calculateProgressBar();
  }, [currentTotal]);

  return (
    <div className="text-gray-600 bg-white">
      <div
        id="progress"
        className="container flex flex-col py-40 space-y-8 text-center"
      >
        <div className="mb-8 text-2xl font-bold sm:text-3xl md:text-4xl text-primary-700">
          {data.title}
        </div>
        <div id="progressText" className="text-xl">
          <span className="block text-5xl font-bold md:inline">
            {currentTotal.toFixed(2)}
            {data.currency}
          </span>{" "}
          {data.outOf}{" "}
          <span className="font-bold">
            {goal}
            {data.currency}
          </span>{" "}
          {data.donated}
        </div>
        <div className="overflow-hidden w-full bg-gray-300 rounded-lg">
          <div
            id="progressBar"
            className="overflow-hidden text-white bg-primary-700"
          >
            0%
          </div>
        </div>
        {data.bottomText && (
          <div className="max-w-full text-gray-600 prose prose-xl">
            <Markdown>{data.bottomText}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
