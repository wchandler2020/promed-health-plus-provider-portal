import React from "react";

const Contact = () => {
  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-20 max-w-6xl mx-auto space-y-20">
      {/* Contact Form */}
      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 shadow-lg rounded-lg">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map + Address */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Our Location</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            123 Main Street, Suite 100
            <br />
            Philadelphia, PA 19103
          </p>
          <div className="w-full h-64">
            <iframe
              title="Philadelphia Office Location"
              className="w-full h-full rounded-md"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.932372363136!2d-75.16522168461986!3d39.95258397942366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c88c98e5cfb1%3A0x63a04a1bbf3d78d6!2sPhiladelphia%20City%20Hall!5e0!3m2!1sen!2sus!4v1689988123456"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">How can I contact support?</h4>
            <p className="text-gray-600 text-sm">
              Use the contact form above or email us at support@example.com.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold">What are your support hours?</h4>
            <p className="text-gray-600 text-sm">
              We’re available Monday–Friday, 9am to 6pm EST.
            </p>
          </div>
        </div>
      </div>

      {/* Help Center */}
      <div className="bg-blue-50 p-6 rounded-md">
        <h2 className="text-lg font-semibold text-blue-800">Need More Help?</h2>
        <p className="text-blue-700 text-sm">
          Visit our{" "}
          <a href="/help-center" className="underline font-medium">
            Help Center
          </a>{" "}
          for tutorials, documentation, and more answers.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="bg-green-600 text-white px-6 py-3 rounded-md text-base hover:bg-green-700 transition">
          Get Support Now
        </button>
      </div>
    </div>
  );
};

export default Contact;
