
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Plus,
  Wallet,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar
} from "lucide-react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sorting, setSorting] = useState({ field: "date", direction: "desc" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "deposit",
    amount: "",
    description: "",
  });
  const [userData, setUserData] = useState({
    balance: 0,
    name: "",
    accountNumber: "",
  });

  // Generate mock transaction data
  const generateMockTransactions = () => {
    const today = new Date();
    const transactionTypes = ["deposit", "withdrawal", "transfer"];
    const merchants = [
      "Amazon", "Starbucks", "Netflix", "Uber", "Walmart",
      "Target", "Payroll", "Rent", "Utilities", "Insurance",
      "Grocery Store", "Gas Station", "Pharmacy", "Restaurant",
      "Gym Membership", "Phone Bill", "Internet Bill", "Clothing Store"
    ];
    const descriptions = [
      "Monthly subscription", "Weekly groceries", "Transportation",
      "Bill payment", "Online purchase", "Salary deposit",
      "Refund", "ATM withdrawal", "Transfer to savings",
      "Dining out", "Entertainment", "Healthcare", "Education"
    ];

    const result = [];
    for (let i = 0; i < 20; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];

      const amount = type === "deposit" ?
        Math.floor(Math.random() * 2000) + 50 :
        -(Math.floor(Math.random() * 500) + 10);

      const date = new Date(today);
      date.setDate(today.getDate() - Math.floor(Math.random() * 30));

      result.push({
        id: `t-${i}`,
        type,
        amount,
        merchant,
        description: `${merchant} - ${description}`,
        date: date.toISOString(),
        status: Math.random() > 0.1 ? "completed" : "pending"
      });
    }
    return result;
  };

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [userResponse, transactionsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/user", { // Changed endpoint to /api/user
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
      ]);

      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');

      const userData = await userResponse.json();
      const transactionsData = await transactionsResponse.json();

      setUserData({
        balance: userData.balance,
        name: userData.name,
        accountNumber: userData.accountNumber,
      });
      console.log("transactionsData:", transactionsData);
      setTransactions(transactionsData.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  fetchTransactions();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleTypeChange = (value) => {
    setNewTransaction({ ...newTransaction, type: value });
  };

  const handleCreateTransaction = async (e) => {
  e.preventDefault();

  if (!newTransaction.amount || !newTransaction.description) {
    toast.error("Please fill in all fields");
    return;
  }

  const amount = parseFloat(newTransaction.amount);
  if (isNaN(amount) ){
    toast.error("Please enter a valid amount");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:5000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: newTransaction.type, // Match server's expected field name
        //amount: newTransaction.type === "withdrawal" ? -amount : amount,
        amount : amount,
        description: newTransaction.description,
        currency: "INR" // Add currency field if required by backend
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create transaction");
    }

    const enhancedTransaction = {
      ...data,
      // Extract merchant from description if not provided
      merchant: data.merchant || data.description.split(" - ")[0],
      // Set default status if not provided
      status: data.status || "completed",
    };

    setTransactions([enhancedTransaction, ...transactions]);

    // Update balance
    const newBalance = userData.balance + data.amount;
    setUserData({ ...userData, balance: newBalance });

    // Update localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.balance = newBalance;
      localStorage.setItem("user", JSON.stringify(user));
    }

    toast.success("Transaction created successfully");
    setDialogOpen(false);
    setNewTransaction({
      type: "deposit",
      amount: "",
      description: "",
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    toast.error(error.message);
  }
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSort = (field) => {
    const direction =
      sorting.field === field && sorting.direction === "asc"
        ? "desc"
        : "asc";

    setSorting({ field, direction });
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.merchant.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(transaction => {
      // Apply type filter
      if (filter === "all") return true;
      if (filter === "deposits") return transaction.amount > 0;
      if (filter === "withdrawals") return transaction.amount < 0;
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      const field = sorting.field;

      if (field === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sorting.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (field === "amount") {
        return sorting.direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }

      if (field === "description") {
        const descA = a.description.toLowerCase();
        const descB = b.description.toLowerCase();
        return sorting.direction === "asc"
          ? descA.localeCompare(descB)
          : descB.localeCompare(descA);
      }

      return 0;
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-bank-light pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-bank-primary to-bank-secondary py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold">Transactions</h1>
              <p className="text-white/80 mt-1">Manage your account activity</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Download size={16} className="mr-2" /> Export
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-bank-primary hover:bg-gray-100">
                    <Plus size={16} className="mr-2" /> New Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Transaction</DialogTitle>
                    <DialogDescription>
                      Make a deposit or withdrawal to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTransaction}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Transaction Type</Label>
                        <Select
                          value={newTransaction.type}
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* In the DialogContent JSX */}
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="amount"
                            name="amount"
                            value={newTransaction.amount}
                            onChange={handleInputChange}
                            className="pl-8"
                            placeholder="0.00"
                            type="number"
                            step="1"
                            min="0.01"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={newTransaction.description}
                          onChange={handleInputChange}
                          placeholder="Enter transaction description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-bank-primary hover:bg-bank-secondary"
                      >
                        Create Transaction
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Account Summary Card */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account</h3>
                <p className="text-lg font-semibold mt-1">{userData.name}</p>
                <p className="text-sm text-gray-600">#{userData.accountNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                <p className="text-lg font-semibold mt-1">{formatCurrency(userData.balance)}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
                <p className="text-lg font-semibold mt-1">{transactions.length} Transactions</p>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Transaction History</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <Tabs defaultValue="all" value={filter} onValueChange={handleFilterChange} className="w-full sm:w-auto">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {/* <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger> */}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-bank-primary" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== "all"
                    ? "Try changing your search or filter criteria"
                    : "Create your first transaction to get started"}
                </p>
                {(!searchTerm && filter === "all") && (
                  <Button
                    className="mt-4 bg-bank-primary hover:bg-bank-secondary"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus size={16} className="mr-2" /> New Transaction
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left border-b">
                      <tr>
                        <th
                          className="pb-3 font-medium cursor-pointer"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center">
                            Date
                            {sorting.field === "date" && (
                              sorting.direction === "asc" ?
                                <ChevronUp size={16} className="ml-1" /> :
                                <ChevronDown size={16} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th
                          className="pb-3 font-medium cursor-pointer"
                          onClick={() => handleSort("description")}
                        >
                          <div className="flex items-center">
                            Description
                            {sorting.field === "description" && (
                              sorting.direction === "asc" ?
                                <ChevronUp size={16} className="ml-1" /> :
                                <ChevronDown size={16} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th className="pb-3 font-medium text-right">Mode</th>
                        <th
                          className="pb-3 font-medium text-right cursor-pointer"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center justify-end">
                            Amount
                            {sorting.field === "amount" && (
                              sorting.direction === "asc" ?
                                <ChevronUp size={16} className="ml-1" /> :
                                <ChevronDown size={16} className="ml-1" />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 mr-3 flex items-center justify-center rounded-full bg-gray-100">
                                <Calendar size={18} className="text-gray-600" />
                              </div>
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{transaction.merchant}</p>
                              <p className="text-sm text-gray-500">{transaction.description}</p>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            {transaction.type === "deposit" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Credit
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Debit
                              </Badge>
                            )}
                          </td>
                          <td className={`py-4 text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <div className="flex items-center justify-end">
                              {transaction.type == "deposit" ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div>
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsPage;
