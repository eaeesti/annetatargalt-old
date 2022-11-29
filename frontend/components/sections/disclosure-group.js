import React from "react";
import Markdown from "react-markdown";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const DisclosureGroup = ({ data }) => {
  return (
    <section className="py-8 md:bg-slate-200 md:py-16">
      <div className="container flex min-h-[32rem] flex-col items-center">
        <div className="flex flex-col space-y-8 w-full bg-white md:w-auto md:p-8 md:rounded-2xl">
          {data.disclosures.map((disclosure) => (
            <Disclosure key={disclosure.id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex flex-row justify-between p-3 space-x-2 w-full max-w-full md:max-w-prose min-w-full md:min-w-[65ch] text-left rounded-t-lg border-b hover:bg-slate-100">
                    <div className="text-lg font-bold">{disclosure.title}</div>
                    <div className="flex flex-col justify-center">
                      <ChevronUpIcon
                        className={
                          `${open ? "transform rotate-180" : ""}` +
                          " w-6 h-6 transition-transform duration-300"
                        }
                      />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    show={open}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-90 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-150 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-90 opacity-0"
                  >
                    <Disclosure.Panel className="static px-3 -mt-5 text-gray-600 prose">
                      <Markdown>{disclosure.body}</Markdown>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisclosureGroup;
