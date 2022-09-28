import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useRouter } from "next/router";
import { fetchAPI } from "utils/api";
import { validateIdCode } from "utils/estonia";
import { externalLinkIcon, flashRed, flashRedById } from "utils/dom";
import NextImage from "./image";
import Markdown from "react-markdown";

const EstonianDonationBox = ({ data }) => {
  const router = useRouter();
  const amountChoices = [
    data.amount1 + data.currency,
    data.amount2 + data.currency,
    data.amount3 + data.currency,
    data.otherButtonText,
  ];
  let [amount, setAmount] = useState(Number(data.amount2));
  let [otherAmount, setOtherAmount] = useState("");
  let [amountChoice, setAmountChoice] = useState(amountChoices[1]);
  let [donationType, setDonationType] = useState("recurring");
  let [readTerms, setReadTerms] = useState(false);
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [idCode, setIdCode] = useState("");
  let [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);
  let [bank, setBank] = useState("");
  let [donateAsCompany, setDonateAsCompany] = useState(false);
  let [companyName, setCompanyName] = useState("");
  let [companyCode, setCompanyCode] = useState("");
  let [clickCount, setClickCount] = useState(0); // this is used for a state hook callback with effect
  let [step, setStep] = useState(1);

  const organizations = [...data.organizations].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined && a.order !== b.order) return a.order - b.order;
    return a.id - b.id;
  });

  let [proportions, setProportions] = useState(generateProportions());
  let [choosingProportions, setChoosingProportions] = useState(false);

  function generateProportions() {
    const defaultProportions = organizations.reduce(
      (obj, org) => Object.assign(obj, { [org.name]: { proportion: 0, locked: false } }),
      {}
    );
    const firstOrganization = organizations[0].name;
    defaultProportions[firstOrganization].proportion = 100;
    return defaultProportions;
  }

  function calculateProportions(oldProportions, targetOrganization, proportion) {
    const newProportions = { ...oldProportions };

    let lockedOrganizations = [];
    let unlockedOrganizations = [];
    let totalLocked = 0;
    let totalUnlocked = 0;

    for (let organization of organizations) {
      if (organization.name === targetOrganization) {
        continue;
      } else if (newProportions[organization.name].locked) {
        lockedOrganizations.push(organization.name);
        totalLocked += Number(newProportions[organization.name].proportion);
      } else {
        unlockedOrganizations.push(organization.name);
        totalUnlocked += Number(newProportions[organization.name].proportion);
      }
    }

    let newProportion;
    if (unlockedOrganizations.length === 0) {
      newProportion = newProportions[targetOrganization].proportion;
    } else if (totalLocked + Number(proportion) > 100) {
      newProportion = 100 - totalLocked;
    } else {
      newProportion = Number(proportion);
    }

    newProportions[targetOrganization] = {
      locked: false,
      proportion: newProportion,
    };
    const targetDelta = Number(oldProportions[targetOrganization].proportion) - newProportion;

    if (targetDelta === 0) {
      newProportions[targetOrganization] = {
        ...newProportions[targetOrganization],
        locked: true,
      };
      return newProportions;
    }

    const adder = targetDelta / Math.abs(targetDelta);
    for (let i = 0; i < Math.abs(targetDelta); i++) {
      let organizationsToChange;
      organizationsToChange = unlockedOrganizations.filter((org) => newProportions[org].proportion > 0);
      if (organizationsToChange.length === 0 && adder >= 0) organizationsToChange = unlockedOrganizations;
      let organizationToChangeIndex = (totalUnlocked - (adder < 0)) % organizationsToChange.length;
      const organizationToChange = organizationsToChange[organizationToChangeIndex];
      const oldProportion = newProportions[organizationToChange].proportion;
      newProportions[organizationToChange] = {
        locked: false,
        proportion: oldProportion + adder,
      };
      totalUnlocked += adder;
    }

    return newProportions;
  }

  function setCalculatedProportions(targetOrganization, proportion) {
    setProportions(calculateProportions(proportions, targetOrganization, proportion));
  }

  function toggleLock(organization) {
    const newProportions = { ...proportions };
    const oldOrganization = newProportions[organization];
    newProportions[organization] = {
      ...oldOrganization,
      locked: !oldOrganization.locked,
    };
    setProportions(newProportions);
  }

  function lockProportion(organization) {
    const newProportions = { ...proportions };
    const oldOrganization = newProportions[organization];
    newProportions[organization] = { ...oldOrganization, locked: true };
    setProportions(newProportions);
  }

  function proportionsAddUpTo100() {
    const sum = Object.values(proportions).reduce((prev, prop) => prev + prop.proportion, 0);
    return sum === 100;
  }

  function proportionsAsPairs() {
    return Object.entries(proportions).map(([organization, value]) => [organization, value.proportion]);
  }

  function chooseAmount(value) {
    setAmountChoice(value);

    if (value != data.otherButtonText) {
      const numericValue = Number(value.replace(data.currency, ""));
      setAmount(numericValue);
    } else {
      const otherAmountInput = document.getElementById("otherAmountInput");
      setAmount(Number(otherAmountInput.value));
    }
  }

  function onOtherAmountInputKeypress() {
    const otherAmountInput = document.getElementById("otherAmountInput");

    let newOtherAmount = otherAmountInput.value.replace(",", ".");
    // otherAmountInput.value = otherAmountInput.value.replace(",", ".");

    // Must start with digit other than 0 and continue with any digit
    // Can have a . with 0 to 2 digits at the end
    // If it doesn't match, undo the input
    if (!/(^[1-9]\d{0,6}$)|(^[1-9]\d{0,6}\.\d{0,2}$)|^$/.test(newOtherAmount)) {
      newOtherAmount = otherAmountInput.dataset.value;
      console.log("Flashing red!");
      flashRed(otherAmountInput);
    } else {
      otherAmountInput.dataset.value = newOtherAmount;
      setAmount(Number(newOtherAmount));
    }

    setOtherAmount(newOtherAmount);
  }

  function onIdCodeInputKeypress() {
    const idCodeInput = document.getElementById("idCodeInput");

    if (!/(^[1-6]\d{0,10}$)|^$/.test(idCodeInput.value)) {
      idCodeInput.value = idCodeInput.dataset.value;
      flashRed(idCodeInput);
    } else {
      idCodeInput.dataset.value = idCodeInput.value;
      setIdCode(idCodeInput.value);
    }
  }

  function onEmailInputKeypress() {
    const emailInput = document.getElementById("emailInput");

    if (!/(^[^@]{1,64}@?[A-Za-z0-9õäöüÕÄÖÜ\.-]*$)|^$/.test(emailInput.value)) {
      emailInput.value = emailInput.dataset.value;
      flashRed(emailInput);
    } else {
      emailInput.dataset.value = emailInput.value;
      setEmail(emailInput.value);
    }
  }

  function startMakingDonation() {
    if (loading) return;
    setState();
  }

  function goToStep(number) {
    if (number < step || isValidStep(step)) {
      setStep(number);
    }
  }

  function isValidStep(number) {
    let valid = true;

    if (number === 1) {
      if (!["onetime", "recurring"].includes(donationType)) {
        valid = false;
      }

      if (!readTerms) {
        flashRed(document.getElementById("readTermsContainer"));
        valid = false;
      }

      if (amount <= 0) {
        flashRed(document.getElementById("otherAmountInputContainer"));
        valid = false;
      }

      if (!firstName) {
        flashRed(document.getElementById("firstNameInputContainer"));
        valid = false;
      }

      if (!lastName) {
        flashRed(document.getElementById("lastNameInputContainer"));
        valid = false;
      }

      if (!validateIdCode(idCode)) {
        flashRed(document.getElementById("idCodeInputContainer"));
        valid = false;
      }

      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        flashRed(document.getElementById("emailInputContainer"));
        valid = false;
      }

      if (donationType === "recurring" && !bank) {
        flashRed(document.getElementById("bankSelection"));
        valid = false;
      }

      if (donateAsCompany && !companyName) {
        flashRed(document.getElementById("companyNameInputContainer"));
        valid = false;
      }

      if (donateAsCompany && !companyCode) {
        flashRed(document.getElementById("companyCodeInputContainer"));
        valid = false;
      }
    } else if (step === 2) {
      if (!proportionsAddUpTo100()) {
        flashRedById("proposrtionsInputContainer");
        valid = false;
      }
    }

    return valid;
  }

  function openLinksInNewTab() {
    if (!document) return;
    document.querySelectorAll(".new-tab-links a").forEach((link) => {
      if (link.getAttribute("target") === "_blank") return;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener norefferer");
      link.innerHTML += externalLinkIcon;
    });
  }
  useEffect(() => {
    openLinksInNewTab();
  });

  function setState() {
    setClickCount((count) => count + 1);
  }

  // Run when clickCount is updated
  const makeDonation = async () => {
    if (clickCount === 0) return;
    if (step !== 2 || !isValidStep(2)) return;

    const body = {
      country: "EE",
      type: donationType,
      amount: amount,
      firstName: firstName,
      lastName: lastName,
      email: email,
      idCode: idCode,
      bank: bank,
      donateAsCompany: donateAsCompany,
      choosingProportions: choosingProportions,
      proportions: proportionsAsPairs(),
    };
    if (donateAsCompany) {
      body["companyName"] = companyName;
      body["companyCode"] = companyCode;
    }

    setLoading(true);

    try {
      // console.log("Making donation with data:", body);
      const response = await fetchAPI("/donate", {
        method: "POST",
        body: JSON.stringify(body),
      });
      // console.log(response);
      if (response.success) {
        // If bank has instructions, open in new tab instead
        if (
          donationType == "recurring" &&
          data.banks.find((bankIcon) => bankIcon.name === bank && bankIcon.instructions)
        ) {
          window.open(response.paymentURL);
        } else {
          router.push(response.paymentURL);
        }
      } else {
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    makeDonation();
  }, [clickCount]);

  return (
    <div id="donation" className="absolute p-8 w-full bg-white rounded-2xl shadow-2xl text-primary-900">
      <form
        className="block relative"
        onSubmit={(event) => {
          event.preventDefault();
          startMakingDonation();
        }}
      >
        {step === 1 && (
          <div id="step1" className="flex flex-col space-y-4">
            <h1 className="mb-2 text-3xl font-bold leading-snug">{data.title}</h1>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  className="w-5 h-5 border border-gray-300 cursor-pointer form-radio text-primary-700 focus:ring-2"
                  value="recurring"
                  checked={donationType === "recurring"}
                  onChange={() => setDonationType("recurring")}
                />
                <span className="ml-2">{data.recurringDonationText}</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="onetime"
                  className="w-5 h-5 border border-gray-300 cursor-pointer form-radio text-primary-700 focus:ring-2"
                  checked={donationType === "onetime"}
                  onChange={() => setDonationType("onetime")}
                />
                <span className="ml-2">{data.singleDonationText}</span>
              </label>
            </div>
            <div className="flex justify-evenly items-center space-x-4 w-full">
              <RadioGroup value={amountChoice} onChange={chooseAmount} className="w-full">
                <RadioGroup.Label className="sr-only">{data.amountLabel}</RadioGroup.Label>
                <div className="flex flex-row space-x-4 w-full">
                  {amountChoices.map((amountChoice) => (
                    <RadioGroup.Option
                      key={amountChoice}
                      value={amountChoice}
                      aria-label={`Switch amount to ${amountChoice}`}
                      className={({ active, checked }) =>
                        `${checked ? "ring-primary-700 ring-2" : "ring-gray-300 ring-1"}
                    p-3 text-center rounded-lg cursor-pointer select-none w-full hover:bg-gray-100 focus:ring-3`
                      }
                    >
                      {amountChoice}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <div
              id="otherAmountInputContainer"
              className={`${amountChoice === data.otherButtonText ? "block" : "hidden"} flex flex-row`}
            >
              <label htmlFor="otherAmountInput" className="sr-only">
                {data.otherButtonInputText}
              </label>
              <input
                id="otherAmountInput"
                name="otherAmount"
                className="p-3 w-10/12 rounded-l-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                type="text"
                maxLength="32"
                data-value=""
                value={otherAmount}
                placeholder={data.otherButtonInputText}
                onInput={onOtherAmountInputKeypress}
              />
              <div className="px-4 py-3 w-2/12 text-center bg-gray-200 rounded-r-lg border border-l-0 border-gray-300 select-none">
                {data.currency}
              </div>
            </div>
            <div className="flex flex-row space-x-4">
              <div id="firstNameInputContainer" className="w-1/2">
                <label htmlFor="firstNameInput" className="sr-only">
                  {data.firstName}
                </label>
                <input
                  id="firstNameInput"
                  name="firstName"
                  type="text"
                  maxLength="128"
                  placeholder={data.firstName}
                  onInput={(event) => setFirstName(event.target.value)}
                  value={firstName}
                  className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                ></input>
              </div>
              <div id="lastNameInputContainer" className="w-1/2">
                <label htmlFor="lastNameInput" className="sr-only">
                  {data.lastName}
                </label>
                <input
                  id="lastNameInput"
                  name="lastName"
                  type="text"
                  maxLength="128"
                  placeholder={data.lastName}
                  onInput={(event) => setLastName(event.target.value)}
                  value={lastName}
                  className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                ></input>
              </div>
            </div>
            <div id="idCodeInputContainer" className="relative group">
              <label htmlFor="idCodeInput" className="sr-only">
                {data.idcode}
              </label>
              <input
                id="idCodeInput"
                name="idCode"
                type="text"
                placeholder={data.idcode}
                data-value=""
                onInput={onIdCodeInputKeypress}
                value={idCode}
                className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
              ></input>
              {data.idCodeTooltip && (
                <div className="hidden absolute bottom-8 z-40 flex-col items-center mb-6 w-full opacity-90 pointer-events-none group-focus-within:flex">
                  <span className="relative z-10 p-4 text-center text-white whitespace-normal bg-gray-800 rounded-lg shadow-2xl">
                    {data.idCodeTooltip}
                  </span>
                  <div className="-mt-2 w-4 h-4 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </div>
            <div id="emailInputContainer">
              <label htmlFor="emailInput" className="sr-only">
                {data.email}
              </label>
              <input
                id="emailInput"
                name="email"
                type="text"
                placeholder={data.email}
                data-value=""
                onInput={onEmailInputKeypress}
                value={email}
                className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:border-primary-700 focus:ring-1 focus:ring-primary-700"
              ></input>
            </div>
            <div id="donateAsCompanyContainer" className="flex">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="donateAsCompanyInput"
                  type="checkbox"
                  name="donateAsCompany"
                  className="w-5 h-5 rounded-md border border-gray-300 transition-colors cursor-pointer form-checkbox text-primary-700"
                  value={donateAsCompany}
                  checked={donateAsCompany}
                  onChange={(event) => setDonateAsCompany(event.target.checked)}
                />
                <span className="ml-3">{data.donateAsCompanyText}</span>
              </label>
            </div>
            {donateAsCompany && (
              <div id="companyNameInputContainer">
                <label htmlFor="companyNameInput" className="sr-only">
                  {data.companyNameText}
                </label>
                <input
                  id="companyNameInput"
                  name="companyName"
                  type="text"
                  placeholder={data.companyNameText}
                  data-value=""
                  onInput={(event) => setCompanyName(event.target.value)}
                  value={companyName}
                  className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:border-primary-700 focus:ring-1 focus:ring-primary-700"
                ></input>
              </div>
            )}
            {donateAsCompany && (
              <div id="companyCodeInputContainer">
                <label htmlFor="companyCodeInput" className="sr-only">
                  {data.companyCodeText}
                </label>
                <input
                  id="companyCodeText"
                  name="companyCode"
                  type="text"
                  placeholder={data.companyCodeText}
                  data-value=""
                  onInput={(event) => setCompanyCode(event.target.value)}
                  value={companyCode}
                  className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:border-primary-700 focus:ring-1 focus:ring-primary-700"
                ></input>
              </div>
            )}
            {donationType === "recurring" && (
              <div className="flex flex-col space-y-4">
                <RadioGroup value={bank} onChange={setBank} className="w-full">
                  <RadioGroup.Label className="sr-only">{data.bank}</RadioGroup.Label>
                  <div id="bankSelection" className="grid grid-cols-3 gap-4 w-full">
                    {data.banks.map((bankIcon) => (
                      <RadioGroup.Option
                        key={bankIcon.name}
                        value={bankIcon.name}
                        aria-label={`Switch bank to ${bankIcon.name}`}
                        className={({ active, checked }) =>
                          `${checked ? "ring-primary-700 ring-2" : "ring-1 ring-gray-300"}
                    text-center rounded-lg cursor-pointer select-none w-full hover:bg-gray-100 focus:ring-3 transition-colors`
                        }
                      >
                        <NextImage media={bankIcon.icon} className="w-full h-full rounded-lg" unoptimized />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                {data.banks
                  .filter((bankIcon) => bankIcon.instructions && bank === bankIcon.name)
                  .map((bankIcon) => (
                    <div key="bankIcon.name" className="prose prose-sm text-primary-900">
                      <Markdown>{bankIcon.instructions}</Markdown>
                    </div>
                  ))}
              </div>
            )}
            <div id="readTermsContainer" className="flex">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="readTermsInput"
                  type="checkbox"
                  name="readTerms"
                  className="w-5 h-5 rounded-md border border-gray-300 transition-colors cursor-pointer form-checkbox text-primary-700"
                  value="recurring"
                  checked={readTerms}
                  onChange={(event) => setReadTerms(event.target.checked)}
                />
                <div className="ml-3 prose prose-donationbox new-tab-links text-primary-900">
                  <Markdown>{data.termsText}</Markdown>
                </div>
              </label>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                className="block px-8 py-3 w-full text-base font-semibold tracking-wider text-center text-white uppercase rounded-lg border transition-colors border-primary-700 bg-primary-700 hover:border-primary-800 hover:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:outline-none"
                onClick={() => goToStep(2)}
                disabled={loading}
              >
                {data.nextButtonText}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div id="step2" className="flex flex-col">
            <div className="flex flex-row items-center mb-8 space-x-4">
              <a
                className="inline-block rounded-xl transition-opacity cursor-pointer hover:opacity-70"
                onClick={() => goToStep(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1.5 w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              </a>
              <h1 className="ml-4 text-3xl font-bold leading-snug">{data.chooseOrganizationsText}</h1>
            </div>
            <div className="flex flex-col items-start mb-8 space-y-4">
              {/* <div className="">
                Annetad{" "}
                <span className="text-xl font-bold">
                  {amount}
                  {data.currency}
                </span>{" "}
                tõhusatele heategevustele!
              </div> */}
              <label className="inline-flex items-center w-auto cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border border-gray-300 transition-colors cursor-pointer form-checkbox text-primary-700"
                  checked={!choosingProportions}
                  onChange={(event) => setChoosingProportions(!event.target.checked)}
                />
                <span className="ml-3">{data.letExpertsChooseText}</span>
              </label>
            </div>
            <div
              id="proportionInputContainer"
              className={`flex flex-col space-y-7 mb-4 ${
                choosingProportions ? "":"opacity-25 cursor-default pointer-events-none select-none"}`}
            >
              {organizations.map((organization, i) => (
                <div key={organization.name} className="flex flex-col">
                  <div className="flex relative flex-row items-center mb-1 space-x-2">
                    <h2 className="font-bold text-md">{organization.name}</h2>
                    {organization.info && (
                      <div className="group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 cursor-pointer group-hover:opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="hidden absolute left-0 bottom-1 z-40 flex-col items-center mb-6 w-full opacity-90 pointer-events-none group-hover:flex">
                          <span className="relative z-10 p-4 text-center text-white whitespace-normal bg-gray-800 rounded-lg shadow-2xl new-tab-links">
                            <Markdown>{organization.info}</Markdown>
                          </span>
                          <div className="-mt-2 w-4 h-4 bg-gray-800 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center space-x-3">
                    <div className="flex relative flex-col justify-center w-full">
                      <div className="absolute my-auto w-full h-2.5 bg-gray-200 rounded-full"></div>
                      <div
                        className="absolute my-auto w-1/2 h-2.5 rounded-full opacity-25 bg-primary-600"
                        style={{
                          width: `${proportions[organization.name].proportion}%`,
                        }}
                      ></div>
                      <input
                        className="z-10 form-range"
                        type="range"
                        min="0"
                        max="100"
                        onInput={(event) => setCalculatedProportions(organization.name, event.target.value)}
                        onMouseUp={() => lockProportion(organization.name)}
                        value={proportions[organization.name].proportion}
                      />
                    </div>
                    <div
                      className={`w-16 text-lg font-bold text-center ${
                        proportions[organization.name].proportion == 0 ? "opacity-25" : ""
                      }`}
                    >
                      {proportions[organization.name].proportion}%
                    </div>
                    <a
                      className="transition-opacity cursor-pointer hover:opacity-70"
                      onClick={() => toggleLock(organization.name)}
                    >
                      {!proportions[organization.name].locked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {proportions[organization.name].locked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="m12 2c-1.2 0-2.5 0.4-3.4 1.3s-1.6 2.2-1.6 3.7v3h-1c-1.6 0-3 1.4-3 3v6c0 1.6 1.4 3 3 3h12c1.6 0 3-1.4 3-3v-6c0-1.6-1.4-3-3-3h-1v-3c0-1.6-0.63-2.9-1.6-3.7-0.96-0.85-2.2-1.3-3.4-1.3zm0 2c0.78 0 1.5 0.26 2.1 0.75 0.54 0.48 0.91 1.2 0.91 2.3v3h-4.4-1.6v-3c0-1.1 0.37-1.8 0.91-2.3 0.54-0.48 1.3-0.75 2.1-0.75zm0.0039 10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
                        </svg>
                      )}
                    </a>
                  </div>
                </div>
              ))}
              <div className="mb-4 prose prose-donationbox new-tab-links text-primary-900">
                <Markdown>{data.readMoreText}</Markdown>
              </div>
            </div>
            <button
              type="submit"
              className="block px-8 py-3 w-full text-base font-semibold tracking-wide text-center text-white uppercase rounded-lg border transition-colors border-primary-700 bg-primary-700 hover:border-primary-800 hover:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:outline-none"
              // onClick={() => startMakingDonation()}
              disabled={loading}
            >
              {data.donationButtonText}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EstonianDonationBox;
