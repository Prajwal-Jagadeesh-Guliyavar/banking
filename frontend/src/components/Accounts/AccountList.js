import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../services/api';
import './AccountList.css';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts()
      .then(response => setAccounts(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="card">
      <h2 className="section-title">Account Portfolio</h2>
      <div className="account-grid">
        {accounts.map(account => (
          <div key={account.account_number} className="account-card">
            <div className="account-header">
              <span className="account-type">{account.acc_type}</span>
              <span className="account-number">#{account.account_number}</span>
            </div>
            <div className="account-balance">
              ${parseFloat(account.balance).toLocaleString()}
            </div>
            <div className="account-meta">
              <span>Client ID: {account.customer_id}</span>
              <span>Last Activity: 2d ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;