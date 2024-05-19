import React from 'react';

const Shipping = () => {
    return (
        <div className="">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-sm font-bold">
                <div className="bg-white dark:bg-primary-color dark:text-white w-fit p-6">
                    <h2 className="text-5xl font-extrabold text-center mb-4">Shipping Policy</h2>
                    <ul className="w-fit">
                        <li className="mb-2"><span className="font-bold">1. Indian Orders</span> will take approx 20 days to deliver.</li>
                        <li className="mb-2"><span className="font-bold">2. UAE orders</span> will be delivered within 7 working days.</li>
                        <li className="mb-2"><span className="font-bold">3. GCC and Other countries Orders</span> will be delivered in 15 working days.</li>
                        <li className="mb-2"><span className="font-bold">4. Free Delivery</span> for India, Dubai, Sharjah and Ajman.</li>
                        <li className="mb-2"><span className="font-bold">5. Shipping Charges</span> will apply for Far Emirates, Gcc and rest of the world 🌎</li>
                        <li className="mb-2">
                            <span className="font-bold">6: For Wholesale Orders and Discounted Rates,</span><br /> Fill the Contact us form or WhatsApp on +971521660581
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Shipping;