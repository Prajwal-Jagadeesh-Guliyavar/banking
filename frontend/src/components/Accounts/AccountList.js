import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../services/api';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts()
      .then(response => setAccounts(response.data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  return (
    <div>
      <h2>Account List</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.account_number}>
            {account.account_number} - Balance: ${account.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;