import React, { useState } from "react";
// import afk from '../../../../src/assets/Image/Group.png'

interface FAQItem {
  question: string;
  answer: string;
}

const Afk: React.FC = () => {
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
   
    
  ];

  return (
    <section className="">
      {/* FAQ Section */}
      <div className=" lg:w-[1300px]  mx-auto px-6 py-12">
        
        <div className="mt-8 space-y-8 lg:mt-12">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="p-6 lg:p-8 rounded-lg bg-white border border-gray-200"
            >
              <button
                className="flex items-center justify-between w-full focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h1 className="font-semibold">{item.question}</h1>
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
                <p className="mt-4 text-sm">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      {/* <div className="w-full lg:w-1/3 flex items-center justify-center bg-base-300== p-4">
        <img src={afk} alt="FAQ Illustration" className="max-w-full h-auto" />
      </div> */}
    </section>
  );
};

export default Afk;
