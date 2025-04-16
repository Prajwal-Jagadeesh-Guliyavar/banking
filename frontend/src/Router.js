import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from ".pages/TransactionsPage";

function AppRouter(){
    return (
        <Router>
            <Routes>
                <Route path = "/" elment = {<Dashboard />} />
                <Route path = "/customers" element = {<CustomersPage/>} />
                <Route path = "/transactions" element = {<TransactionsPage/>} />
                <Route path = "/accounts" element = {<AccountsPage/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;