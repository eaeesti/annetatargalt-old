import { RadioGroup } from "@headlessui/react";
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { outputsPerDonation } from "utils/impact";
import { round } from "utils/numbers";
import CustomLink from "../elements/custom-link";

const ImpactCalculator = ({ data, fetchedData }) => {
  let [donationAmount, setDonationAmount] = useState("");
  let [interventionChoice, setInterventionChoice] = useState();

  function onDonationAmountInputKeypress() {
    const donationAmountInput = document.getElementById("donationAmountInput");
    let newAmount = donationAmountInput.value.replace(",", ".");

    // Must start with digit other than 0 and continue with any digit
    // Can have a . with 0 to 2 digits at the end
    // If it doesn't match, undo the input
    if (!/(^[1-9]\d{0,7}$)|(^[1-9]\d{0,7}\.\d{0,2}$)|^$/.test(newAmount)) {
      newAmount = donationAmountInput.dataset.value;
    } else {
      donationAmountInput.dataset.value = newAmount;
    }
    setDonationAmount(newAmount);
  }

  function shouldShowResults() {
    return !!donationAmount && !!interventionChoice;
  }

  return (
    <div className="bg-white" id={data.anchor}>
      <div className="container flex flex-col py-32 space-y-12">
        <div className="text-4xl font-bold tracking-tight text-center text-primary-700">
          {data.title}
        </div>
        <form
          id="contactForm"
          className="flex flex-col items-center space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="w-full max-w-lg">
            <label htmlFor="donationAmountInput" className="sr-only">
              {data.donationText}
            </label>
            <div className="relative">
              <input
                id="donationAmountInput"
                type="text"
                className="px-4 py-3 w-full text-2xl rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                data-value=""
                placeholder={data.donationText}
                value={donationAmount}
                onInput={onDonationAmountInputKeypress}
              />
              <div className="flex absolute top-0 right-4 justify-center items-center h-full text-3xl pointer-events-none select-none text-slate-400">
                {data.currency}
              </div>
            </div>
          </div>
          <RadioGroup
            value={interventionChoice}
            onChange={setInterventionChoice}
            className="w-full max-w-lg"
          >
            <RadioGroup.Label className="sr-only">
              {data.interventionText}
            </RadioGroup.Label>
            <div className="flex flex-col space-x-0 space-y-4 w-full sm:flex-row sm:space-y-0 sm:space-x-4">
              {data.interventions.map((intervention) => (
                <RadioGroup.Option
                  key={intervention.name}
                  value={intervention}
                  aria-label={`Switch intervention to ${intervention.name}`}
                  className={({ checked }) =>
                    `${
                      checked
                        ? "ring-primary-700 ring-2"
                        : "ring-gray-300 ring-1"
                    }
                    p-3 text-center rounded-lg cursor-pointer select-none w-full hover:bg-gray-100 focus:ring-3 text-lg`
                  }
                >
                  {intervention.name}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </form>
        {shouldShowResults() && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col space-y-8 w-full max-w-3xl">
              <div className="flex flex-col p-8 space-y-4 text-2xl text-center rounded-2xl bg-slate-100">
                <div className="text-5xl font-bold text-primary-700">
                  {round(
                    outputsPerDonation(
                      fetchedData.evaluations,
                      interventionChoice.charityCode,
                      Number(donationAmount)
                    ),
                    1
                  )}
                </div>
                <div className="text-lg">
                  {interventionChoice.partitiveIntervention}
                </div>
              </div>
              <div className="text-lg">
                <span className="font-bold text-primary-700">
                  {interventionChoice.charityName}
                </span>{" "}
                {interventionChoice.description}
              </div>
              <div className="flex flex-col space-y-3">
                {interventionChoice.links.concat(data.links).map((link) => (
                  <CustomLink link={link}>
                    <div className="text-primary-700 hover:opacity-70">
                      {link.text}
                      {link.newTab ? (
                        <ArrowTopRightOnSquareIcon className="inline mb-1 ml-1 w-5 h-5" />
                      ) : (
                        <ArrowRightIcon className="inline mb-1 ml-1 w-5 h-5" />
                      )}
                    </div>
                  </CustomLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactCalculator;
