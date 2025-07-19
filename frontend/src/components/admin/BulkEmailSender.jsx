// src/components/admin/BulkEmailSender.jsx
import React, { useState } from 'react';
import { FaPaperPlane, FaImage, FaLink, FaSpinner } from 'react-icons/fa';

const BulkEmailSender = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    imageUrl: '',
    link: '',
    linkText: '',
    targetGroup: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/admin-bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setSuccess(`Successfully queued ${data.recipientCount} emails for sending!`);
      setFormData({
        subject: '',
        message: '',
        imageUrl: '',
        link: '',
        linkText: '',
        targetGroup: 'all'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Bulk Email</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Target Group:</label>
          <select
            name="targetGroup"
            value={formData.targetGroup}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="all">All Users & Contacts</option>
            <option value="users">Registered Users Only</option>
            <option value="event_registrants">Event Registrants Only</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Image URL (optional):</label>
          <div className="flex gap-2">
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded"
            />
            <FaImage className="text-2xl text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block mb-2">Link (optional):</label>
          <div className="flex gap-2">
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded"
            />
            <FaLink className="text-2xl text-gray-400" />
          </div>
        </div>

        {formData.link && (
          <div>
            <label className="block mb-2">Link Text:</label>
            <input
              type="text"
              name="linkText"
              value={formData.linkText}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Learn More"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Send Email
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BulkEmailSender;
