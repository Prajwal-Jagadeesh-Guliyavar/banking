import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers()
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.fname} {customer.lname} - {customer.phone_no}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
