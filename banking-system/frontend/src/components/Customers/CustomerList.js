import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/api';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers()
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div className="customer-list card">
      <h2>Customer Directory</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <div className="customer-details">
              <span className="customer-name">{customer.fname} {customer.lname}</span>
              <span className="customer-phone">{customer.phone_no}</span>
            </div>
            <span className="customer-email">{customer.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;