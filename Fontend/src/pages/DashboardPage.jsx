
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PiggyBank, ArrowUpRight, ArrowDownRight, CreditCard,
  BarChart4, ArrowRight, Wallet, TrendingUp, Clock,
  DollarSign, Plus, Calendar
} from "lucide-react";
import { toast } from "sonner";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);

  const getRandomAmount = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateMockTransactions = () => {
    const today = new Date();
    const transactionTypes = ["deposit", "withdrawal", "transfer"];
    const merchants = [
      "Amazon", "Starbucks", "Netflix", "Uber", "Walmart",
      "Target", "Payroll", "Rent", "Utilities", "Insurance"
    ];

    const result = [];
    for (let i = 0; i < 5; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = type === "deposit" ?
        getRandomAmount(50, 2000) :
        -getRandomAmount(10, 500);

      const date = new Date(today);
      date.setDate(today.getDate() - i);

      result.push({
        id: `t-${i}`,
        type,
        amount,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        date: date.toISOString(),
        status: "completed"
      });
    }
    return result;
  };

  const generateMockBalanceHistory = () => {
    const today = new Date();
    const result = [];
    let balance = 5000; // Starting balance

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Random daily fluctuation between -200 and +300
      const fluctuation = Math.random() * 500 - 200;
      balance += fluctuation;
      balance = Math.max(balance, 1000); // Ensure balance doesn't go too low

      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: Math.round(balance * 100) / 100
      });
    }

    return result;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // If not in localStorage, fetch from API
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");

        // For demo purposes, create mock user data
        const mockUser = {
          name: "Demo User",
          email: "demo@example.com",
          accountNumber: "1234567890",
          balance: 5000.00,
          accountType: "Savings",
          joined: "January 2023",
        };
        setUserData(mockUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    setTransactions(generateMockTransactions());
    setBalanceHistory(generateMockBalanceHistory());
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
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

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-brand-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bank-light pb-12">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-bank-primary to-bank-secondary py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold">Welcome, {userData?.name || "User"}!</h1>
              <p className="text-white/80 mt-1">Here's your financial summary</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-white text-bank-primary hover:bg-gray-100">
                <Plus size={16} className="mr-2" />
                Quick Actions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Account Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Account Balance</span>
                <Badge className="bg-bank-primary">{userData?.accountType || "Checking"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <h2 className="text-3xl font-bold">{formatCurrency(userData?.balance || 0)}</h2>
                  <p className="text-xs text-gray-500 mt-1">Account Number: {userData?.accountNumber || "XXXX-XXXX-XXXX"}</p>
                </div>

                <div className="h-[200px] md:h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={balanceHistory}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1F6BCC" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1F6BCC" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#f0f0f0' }}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${value}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 500', 'dataMax + 500']}
                      />
                      <Tooltip
                        formatter={(value) => [`₹${value.toFixed(2)}`, 'Balance']}
                        labelFormatter={(value) => `Date: ${value}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#1F6BCC"
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/transactions">
                    <Button variant="outline" className="w-full h-[70px] flex flex-col justify-center border-dashed">
                      <PiggyBank className="h-6 w-6 mb-1 text-bank-primary" />
                      <span className="text-xs">New Transaction</span>
                    </Button>
                  </Link>
                  <Link to="/loan">
                    <Button variant="outline" className="w-full h-[70px] flex flex-col justify-center border-dashed">
                      <TrendingUp className="h-6 w-6 mb-1 text-bank-primary" />
                      <span className="text-xs">Apply for Loan</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-[70px] flex flex-col justify-center border-dashed">
                    <CreditCard className="h-6 w-6 mb-1 text-bank-primary" />
                    <span className="text-xs">Cards</span>
                  </Button>
                  <Button variant="outline" className="w-full h-[70px] flex flex-col justify-center border-dashed">
                    <BarChart4 className="h-6 w-6 mb-1 text-bank-primary" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rent Payment</p>
                        <p className="text-xs text-gray-500">Due in 5 days</p>
                      </div>
                    </div>
                    <p className="font-medium">₹1,200</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Electric Bill</p>
                        <p className="text-xs text-gray-500">Due in 10 days</p>
                      </div>
                    </div>
                    <p className="font-medium">₹85</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/payments">
                    <Button variant="link" className="p-0 h-auto text-bank-primary">
                      View all payments <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
              <Link to="/transactions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">No recent transactions</p>
                ) : (
                  transactions.map((transaction) => {
                    const isDeposit = transaction.amount > 0;
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${isDeposit ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                            {isDeposit ? (
                              <ArrowUpRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.merchant}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className={`font-medium ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                          {isDeposit ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Spending Analysis</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">This Month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Wallet className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span>Shopping</span>
                  </div>
                  <span className="font-medium">₹345.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Groceries</span>
                  </div>
                  <span className="font-medium">₹265.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>Entertainment</span>
                  </div>
                  <span className="font-medium">₹199.00</span>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="link" className="p-0 h-auto text-bank-primary">
                  View detailed analysis <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Personal Loan</p>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Principal</span>
                      <span>₹10,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining</span>
                      <span>₹7,250.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Next payment</span>
                      <span>15 Jun 2023</span>
                    </div>
                  </div>
                </div>
                <Link to="/loan">
                  <Button variant="outline" className="w-full">Apply for new loan</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Vacation Fund</p>
                    <span className="text-sm font-medium">₹1,250 / ₹3,000</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-bank-primary" style={{ width: "42%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">42% completed</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Emergency Fund</p>
                    <span className="text-sm font-medium">₹5,000 / ₹10,000</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-bank-primary" style={{ width: "50%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">50% completed</p>
                </div>

                <Button variant="outline" className="w-full">Create new goal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
