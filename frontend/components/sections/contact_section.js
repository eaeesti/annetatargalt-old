import React from "react";
import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { flashRed, flashRedById } from "utils/dom";
import { fetchAPI } from "utils/api";

const SectionTemplate = ({ data }) => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  let [loading, setLoading] = useState(false);

  async function submit() {
    if (!message) {
      flashRedById("message");
      return;
    }

    const body = { name, email, message };

    setLoading(true);

    try {
      console.log("Sending request with data:", body);
      const response = await fetchAPI("/contact-submissions", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (response.success) {
        const contactForm = document.getElementById("contactForm");
        const contactSuccess = document.getElementById("contactSuccess");
        contactForm.classList.add("opacity-20", "pointer-events-none");
        contactSuccess.classList.remove("hidden");
      } else {
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="container">
        <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
          <div className="px-4 pt-16 pb-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
            <div className="mx-auto max-w-lg">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary-700">{data.getInTouchText}</h2>
              <p className="mt-3 text-lg">{data.getInTouchDescriptionText}</p>
              <dl className="mt-8 text-base">
                <div className="mt-3">
                  <dt className="sr-only">Email</dt>
                  <dd className="flex">
                    <EnvelopeIcon className="flex-shrink-0 w-6 h-6" aria-hidden="true" />
                    <span className="ml-3">{data.contactEmailText}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="px-4 pt-4 pb-16 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <form
                id="contactForm"
                className="grid grid-cols-1 gap-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    {data.nameBoxPlaceholder}
                  </label>
                  <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    autoComplete="name"
                    className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                    placeholder={data.nameBoxPlaceholder}
                    onInput={(event) => setName(event.target.value)}
                    value={name}
                    maxLength={64}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    {data.emailBoxPlaceholder}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                    placeholder={data.emailBoxPlaceholder}
                    onInput={(event) => setEmail(event.target.value)}
                    value={email}
                    maxLength={128}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="message" className="sr-only">
                    {data.messageBoxPlaceholder}
                  </label>
                  <div className="absolute top-1 right-1 text-xs text-gray-400 pointer-events-none select-none">
                    {message.length}/500
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={Math.max(4, Math.round(message.split(/\r\n|\r|\n/).length))}
                    className="p-3 w-full rounded-lg border border-gray-300 transition-colors focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
                    placeholder={data.messageBoxPlaceholder}
                    onInput={(event) => setMessage(event.target.value)}
                    value={message}
                    maxLength={500}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="block px-8 py-3 w-full text-base font-semibold tracking-wide text-center text-white uppercase rounded-lg border transition-colors border-primary-700 bg-primary-700 hover:border-primary-800 hover:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:outline-none"
                    disabled={loading}
                  >
                    {data.submitButtonText}
                  </button>
                </div>
              </form>
              <div
                id="contactSuccess"
                className="hidden absolute top-1/2 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2"
              >
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary-700">
                  {data.successTitleText}
                </h3>
                <p className="mt-3 text-lg">{data.successText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTemplate;
