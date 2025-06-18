// src/pages/CustomerDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById, updateCustomer, deleteCustomer } from '../api/customers'; // API functions
import './CustomerDetailsPage.css'; // CSS for layout

function CustomerDetailsPage() {
  const { id } = useParams(); // Get customer ID from URL
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); // For editable form fields

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await getCustomerById(id);
        setCustomer(data);
        setFormData(data); // Initialize form data with current customer data
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateCustomer(id, formData);
      setCustomer(formData); // Update displayed customer
      setIsEditing(false); // Exit editing mode
      alert('Customer updated successfully!');
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        alert('Customer deleted successfully!');
        // Redirect to customers list after deletion
        // navigate('/customers'); // You'd need useNavigate hook here
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer. Please try again.');
      }
    }
  };

  if (!id) return <div>No customer ID provided.</div>; // Handle new customer creation if needed
  if (loading) return <div>Loading customer details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <div className="customer-details-container">
      <div className="customer-header">
        <h2>{customer.firstName} {customer.lastName}</h2>
        <div>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel Edit' : 'Edit Customer'}
          </button>
          <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
            Delete Customer
          </button>
        </div>
      </div>

      <div className="customer-content-area">
        <div className="customer-sidebar">
          <h3>Details</h3>
          {isEditing ? (
            <>
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              <label>Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <label>Notes:</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="4"></textarea>
              <button onClick={handleUpdate} style={{ marginTop: '10px', backgroundColor: 'green', color: 'white' }}>Save Changes</button>
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Address:</strong> {customer.address}</p>
              <p><strong>Notes:</strong> {customer.notes}</p>
            </>
          )}
        </div>

        <div className="customer-main-area">
          {/* Implement tab navigation here */}
          <div className="tabs">
            <button className="tab-button active">Notes</button>
            <button className="tab-button">Activity</button>
            {/* ... other tabs */}
          </div>
          <div className="tab-content">
            {/* Example: Notes section */}
            <h4>Customer Notes</h4>
            {/* Input for new note */}
            <textarea placeholder="Add a new note..." rows="3" style={{ width: 'calc(100% - 20px)', padding: '10px' }}></textarea>
            <button style={{ marginTop: '10px' }}>Add Note</button>
            {/* Display existing notes (from customer.notes or a separate notes collection if implemented) */}
            <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px' }}>
              <h5>Activity Log</h5>
              {/* Example activity entry */}
              <p>Scheduled call with {customer.firstName} on 2025-06-15.</p>
              <p>Completed project proposal for 'Alpha Project' on 2025-06-01.</p>
            </div>
          </div>
        </div>
      </div>
      <Link to="/customers" style={{ display: 'block', marginTop: '20px' }}>Back to Customers</Link>
    </div>
  );
}

export default CustomerDetailsPage;