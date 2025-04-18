import React, { useEffect, useState} from "react";
import {getTransactions} from "../../services/api";

const TransactionList= () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions()
            .then((response) => getTransactions(response.data))
            .catch((error) => console.log("error fetching the transactions :", error));
    }, []);

    return (
        <div>
            <h2>Transaction List</h2>
            <ul>
                {transactions.map((txn) => (
                    <li key={txn.id}>
                        {txn.transaction_date} - {txn.transaction_type} of ${txn.amount} for account {txn.account_number}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;