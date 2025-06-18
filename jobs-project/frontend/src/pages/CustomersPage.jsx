// src/pages/CustomersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomers, deleteCustomer } from '../api/customers'; // API functions

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        alert('Customer deleted successfully!');
        fetchCustomers(); // Refresh the list
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer.');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading customers...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customers List</h2>
      <Link to="/customers/new" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', marginBottom: '20px' }}>
        Add New Customer
      </Link>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Phone</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/customers/${customer._id}`}>{customer.firstName} {customer.lastName}</Link>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.phone}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleDelete(customer._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && <p>No customers found.</p>}
    </div>
  );
}

export default CustomersPage;