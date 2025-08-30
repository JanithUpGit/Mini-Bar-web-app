// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import Navbar from '../components/nav';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // මෙහිදී backend වෙත දත්ත යැවීමේ ක්‍රියාවලිය සිදුවේ
    // දැනට console එකේ පණිවිඩය පෙන්වමු
    console.log('Form data submitted:', formData);

    setStatus('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' }); // පෝරමය හිස් කරයි

    // ඔබට මෙහි API call එකක් එකතු කළ හැක
    // try {
    //   const response = await apiService.contact.sendMessage(formData);
    //   setStatus('Message sent successfully!');
    // } catch (error) {
    //   setStatus('Failed to send message. Please try again later.');
    // }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 min-h-screen mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
          <p className="text-lg text-gray-600">We'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Details</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-4">
                <Mail size={24} className="text-blue-600" />
                <span>info@sarasavimadurauor.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={24} className="text-blue-600" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={24} className="text-blue-600 mt-1" />
                <span>105 Room,<br/>Sarasavi Madura,<br/>Faculty of Technology University of Ruhuna,<br/>Karagoda Uyangoda,<br/> Kamburupitiya,<br/> Matara,<br/> Sri Lanka</span>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook size={28} />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Instagram size={28} />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Twitter size={28} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            {status && (
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;