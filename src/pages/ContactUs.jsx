import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      } else {
        const errorData = await response.json();
        setSubmitStatus(`Failed to send message: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("Failed to send message. Please try again.");
    }

    // Clear status message after 3 seconds
    setTimeout(() => setSubmitStatus(""), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Contact Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-12 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Send a Message
          </h1>
          {submitStatus && (
            <div
              className={`mb-4 p-3 rounded text-center ${
                submitStatus.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      {/* Contact Information Section */}
      <div className="lg:w-1/2 bg-gray-600 text-white flex items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <Mail className="mr-4 text-white" size={32} />
              <div>
                <p className="text-xl font-semibold">Email</p>
                <p>RISHI@ucsd.edu</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="mr-4 text-white" size={32} />
              <div>
                <p className="text-xl font-semibold">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-4 text-white" size={32} />
              <div>
                <p className="text-xl font-semibold">Address</p>
                <p>Vemavaram, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;