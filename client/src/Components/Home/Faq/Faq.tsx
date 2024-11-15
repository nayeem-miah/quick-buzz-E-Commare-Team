import React from 'react';
import Heading from '../../../Shared/Heading/Heading';

const Faq: React.FC = () => {
    return (
        <div>
            <section>
                <div className="container mx-auto px-4 py-12 md:px-8">
                    <Heading title={'Frequently Asked Questions'} subtitle={'Find answers to our most commonly asked questions about shopping, shipping, and returns.'}/>
                    <div className="space-y-4">
                        <details className="w-full border border-gray-200 rounded-lg dark:border-gray-700">
                            <summary className="px-6 py-4 cursor-pointer text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                How can I track my order?
                            </summary>
                            <p className="px-6 py-4 ">
                                Once your order is shipped, you will receive a tracking link via email. You can also track your order status through your account on our website.
                            </p>
                        </details>
                        <details className="w-full border border-gray-200 rounded-lg dark:border-gray-700">
                            <summary className="px-6 py-4 cursor-pointer text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                What is your return policy?
                            </summary>
                            <p className="px-6 py-4 ">
                                We offer a 30-day return policy for unused items in their original packaging. For more details, please visit our <a href="/returns" className="text-blue-500 underline">Returns & Exchanges</a> page.
                            </p>
                        </details>
                        <details className="w-full border border-gray-200 rounded-lg dark:border-gray-700" open>
                            <summary className="px-6 py-4 cursor-pointer text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                Can I change or cancel my order?
                            </summary>
                            <p className="px-6 py-4 ">
                                Yes, you can modify or cancel your order within 24 hours of placing it. Please contact our customer support team for assistance.
                            </p>
                        </details>
                        <details className="w-full border border-gray-200 rounded-lg dark:border-gray-700">
                            <summary className="px-6 py-4 cursor-pointer text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                Do you offer international shipping?
                            </summary>
                            <p className="px-6 py-4 ">
                                Yes, we ship internationally. Shipping fees and delivery times vary based on location. For more information, see our Shipping Information page.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Faq;