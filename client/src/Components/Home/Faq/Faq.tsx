import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";

interface FAQItem {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "How can I pay for my order?",
      answer:
        "You can pay using bKash, Nagad, Rocket, credit cards, or cash on delivery at checkout.",
    },
    {
      question: "Do you deliver outside Dhaka?",
      answer:
        "Yes, we deliver all over Bangladesh. Delivery charges may vary based on the location.",
    },
    {
      question: "What is your return policy?",
      answer:
        "You can return a product within 7 days if it is damaged or not as described. Terms and conditions apply.",
    },
    {
      question: "How long will delivery take?",
      answer:
        "Delivery typically takes 2-5 business days, depending on your location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order status using the tracking ID sent to your registered email or phone number.",
    },
    {
      question: "Do you offer discounts or promotions?",
      answer:
        "Yes, we offer seasonal discounts and promotions. Follow us on social media to stay updated.",
    },
    {
      question: "What products do you sell?",
      answer:
        "We offer a wide range of products, including electronics, fashion, home appliances, and groceries.",
    },
  ];

  return (
    <section className="">
      <div className="container px-6 py-12 mx-auto">
      <Heading title={'Frequently Asked Questions'} subtitle={'Find answers to our most commonly asked questions about shopping, shipping, and returns.'}/>

        <div className="mt-8 space-y-8 lg:mt-12">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-lg  bg-white border border-gray-200"
            >
              <button
                className="flex items-center justify-between w-full focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h1 className="font-semibold ">
                  {item.question}
                </h1>
                <span
                  className={`rounded-full p-1 ${
                    activeIndex === index ? "bg-red-500" : "bg-[#9E59F7]"
                  } text-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        activeIndex === index
                          ? "M18 12H6"
                          : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      }
                    />
                  </svg>
                </span>
              </button>
              {activeIndex === index && (
                <p className="mt-6 text-sm ">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
