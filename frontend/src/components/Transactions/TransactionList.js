import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/api';
import './TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions()
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="card">
      <h2 className="section-title" style={{color:'black'}}>Transaction Ledger</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
              <td>{transaction.transaction_type}</td>
              <td>•••• {transaction.account_number.slice(-4)}</td>
              <td className={`amount-${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(transaction.amount).toLocaleString()}
              </td>
              <td>
                <span className="status-indicator status-active">Completed</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;