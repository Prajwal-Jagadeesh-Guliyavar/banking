import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calculator,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ChevronRight,
  Wallet,
  Book
} from "lucide-react";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Redirect to login or show login modal
    window.location.href = "/login"; // Adjust based on your auth flow
    throw new Error("Redirecting to login...");
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.status === 401) {
      // Token expired, handle refresh or redirect
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      throw new Error("Session expired, please login again");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

const LoanPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("apply");
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    income: "",
    employment: "employed",
    creditScore: "",
    amount: "",
    purpose: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeLoans, setActiveLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
  const fetchData = async () => {

    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setIsLoadingData(true);
    try {
      // Fetch both loans and applications in parallel
      const [loansResponse, applicationsResponse] = await Promise.all([
        fetchWithAuth("http://localhost:5000/api/loan"),
        fetchWithAuth("http://localhost:5000/api/loan/applications")
      ]);

      // Process loans data
      setActiveLoans(loansResponse.loans.map(loan => ({
        ...loan,
        paymentAmount: calculateMonthlyPayment(loan.amount, loan.interestRate, loan.termMonths),
        remainingBalance: loan.amount, // You'll need to get this from backend
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Temp: next month
      })));

      // Process applications data
      setApplications(applicationsResponse.applications.map(app => ({
        ...app,
        term: app.termMonths || 36 // Fallback to 36 months if not provided
      })));

    } catch (error) {
      console.error("Failed to fetch loan data:", error);
      toast.error(error.message || "Failed to load loan data");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Only fetch data when not on the apply tab
  if (activeTab !== "apply") {
    fetchData();
  }
}, [activeTab]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmploymentChange = (value) => {
    setFormData({ ...formData, employment: value });
  };

  const handleLoanTypeChange = (value) => {
    setLoanType(value);
    //setLoanAmount(10000);
    setLoanTerm(36);
  };

  const calculateMonthlyPayment = (principal, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) /
      (Math.pow(1 + monthlyRate, term) - 1);
    return payment.toFixed(2);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!loanType || loanAmount <= 0 || loanTerm <= 0) {
    toast.error("Please select a loan type and specify amount and term");
    return;
  }

  if (!formData.fullName || !formData.email || !formData.phone || !formData.income || !formData.creditScore) {
    toast.error("Please fill in all required fields");
    return;
  }

  setLoading(true);

  try {
    // Submit loan application
    const result = await fetchWithAuth("http://localhost:5000/api/loan/apply", {
      method: "POST",
      body: JSON.stringify({
        type: "Personal Loan",
        amount: formData.amount,
        purpose: formData.purpose,
        income: parseFloat(formData.income),
        employmentStatus: formData.employment,
        termMonths: loanTerm
      }),
    });

    toast.success(`Loan application ${result.status}`);

    // Refresh both loans and applications in parallel
    const [loans, applications] = await Promise.all([
      fetchWithAuth("http://localhost:5000/api/loan"),
      fetchWithAuth("http://localhost:5000/api/loan/applications")
    ]);
    setActiveLoans(loans.loans);
    setApplications(applications.applications);

    // Reset form
    setLoanType("personal");
    setLoanAmount(10000);
    setLoanTerm(36);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      income: "",
      employment: "employed",
      creditScore: "",
      amount : "",
      purpose: "",
    });

    setActiveTab("applications");
  } catch (error) {
    console.error("Error submitting loan application:", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

const handleCancelApplication = async (applicationId) => {
  try {
    const response = await fetchWithAuth(
      `http://localhost:5000/api/loan/applications/${applicationId}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      toast.success("Application cancelled successfully");
      // Refresh the applications list
      const appsResponse = await fetchWithAuth("http://localhost:5000/api/loan/applications");
      setApplications(appsResponse.applications);
    } else {
      throw new Error("Failed to cancel application");
    }
  } catch (error) {
    console.error("Error cancelling application:", error);
    toast.error(error.message || "Failed to cancel application");
  }
};


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{status}</Badge>;
      case 'rejected':
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-bank-light pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-bank-primary to-bank-secondary py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Loan Center</h1>
          <p className="text-white/80 mt-1">Apply for loans or check your existing loan status</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="apply" value={activeTab} onValueChange={setActiveTab} className="-mt-12 relative z-10">
          <div className="bg-white p-3 rounded-lg shadow-md inline-block">
            <TabsList>
              <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
              <TabsTrigger value="active">Active Loans</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </div>

          {/* Apply for Loan Tab */}
          <TabsContent value="apply" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Loan Options */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Choose Loan Type</CardTitle>
                  <CardDescription>Select the type of loan you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant={loanType === "personal" ? "default" : "outline"}
                      className={`h-auto py-6 flex flex-col items-center ${loanType === "personal" ? "bg-bank-primary hover:bg-bank-secondary" : ""}`}
                      onClick={() => handleLoanTypeChange("personal")}
                    >
                      <CreditCard className="h-8 w-8 mb-2" />
                      <span>Personal Loan</span>
                    </Button>
                  </div>

                  {loanType && (
                    <>
                      <div className="mt-8">
                        <Label htmlFor="loan-amount" className="text-base flex justify-between">
                          <span>Loan Amount</span>
                          <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                        </Label>
                        <div className="pt-6 pb-2">
                          <Slider
                            id="loan-amount"
                            min={1000}
                            max={100000}
                            step={1000}
                            value={[loanAmount]}
                            onValueChange={(values) => setLoanAmount(values[0])}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{formatCurrency(1000)}</span>
                          <span>{formatCurrency(100000)}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="loan-term" className="text-base flex justify-between">
                          <span>Loan Term</span>
                          <span className="font-semibold">
                            {loanTerm} {loanTerm === 1 ? 'month' : 'months'} ({Math.floor(loanTerm / 12)} {Math.floor(loanTerm / 12) === 1 ? 'year' : 'years'})
                          </span>
                        </Label>
                        <div className="pt-6 pb-2">
                          <Slider
                            id="loan-term"
                            min={12}
                            max={120}
                            step={12}
                            value={[loanTerm]}
                            onValueChange={(values) => setLoanTerm(values[0])}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>1 year</span>
                          <span>10 years</span>
                        </div>
                      </div>

                      <Card className="mt-8 bg-gray-50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Payment Estimate</CardTitle>
                            <Calculator className="h-5 w-5 text-gray-500" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Monthly Payment</span>
                              <span className="font-semibold">{formatCurrency(calculateMonthlyPayment(loanAmount, 5.25, loanTerm))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Interest Rate</span>
                              <span className="font-semibold">5.25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Interest</span>
                              <span className="font-semibold">{formatCurrency((calculateMonthlyPayment(loanAmount, 5.25, loanTerm) * loanTerm - loanAmount))}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                              <span className="font-medium">Total Payment</span>
                              <span className="font-semibold">{formatCurrency(calculateMonthlyPayment(loanAmount, 5.25, loanTerm) * loanTerm)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Loan Application Form */}
              <Card className="shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle>Loan Application</CardTitle>
                  <CardDescription>Fill in your information to apply</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="income">Annual Income</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="income"
                              name="income"
                              type="number"
                              value={formData.income}
                              onChange={handleInputChange}
                              className="pl-8"
                              placeholder="60,000"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employment">Employment Status</Label>
                          <Select
                            value={formData.employment}
                            onValueChange={handleEmploymentChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employed">Employed</SelectItem>
                              <SelectItem value="self-employed">Self-Employed</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="creditScore">Credit Score (Estimated)</Label>
                          <Input
                            id="creditScore"
                            name="creditScore"
                            type="number"
                            value={formData.creditScore}
                            onChange={handleInputChange}
                            placeholder="700"
                            min="300"
                            max="850"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Loan Amount to be Sanctioned</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="pl-8"
                            placeholder="1,00,000"
                            required
                          />
                        </div>
                      </div>


                      <div className="space-y-2">
                        <Label htmlFor="purpose">Loan Purpose</Label>
                        <Input
                          id="purpose"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          placeholder="Describe why you need this loan"
                        />
                        <p className="text-xs text-gray-500">
                          This helps us process your application more effectively
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading || !loanType}
                          className="w-full bg-bank-primary hover:bg-bank-secondary"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting Application...
                            </>
                          ) : (
                            "Submit Loan Application"
                          )}
                        </Button>
                      </div>

                      <div className="text-center text-sm text-gray-500">
                        By submitting this application, you agree to our <a href="#" className="text-bank-primary hover:underline">Terms of Service</a> and <a href="#" className="text-bank-primary hover:underline">Privacy Policy</a>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Loans Tab */}
          <TabsContent value="active" className="mt-6">
            {isLoadingData ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary"></div>
              </div>
            ) : activeLoans.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Wallet className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No active loans</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You currently don't have any active loans
                    </p>
                    <Button
                      className="mt-6 bg-bank-primary hover:bg-bank-secondary"
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for a Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeLoans.map((loan) => (
                  <Card key={loan.id} className="shadow-md">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{loan.type}</CardTitle>
                        {getStatusBadge(loan.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Principal Amount</p>
                            <p className="font-semibold text-lg">{formatCurrency(10000)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Remaining Balance</p>
                            <p className="font-semibold text-lg">{formatCurrency(7250)}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">Next Payment</span>
                            </div>
                            <span className="font-semibold">{loan.nextPaymentDate ? formatDate(loan.nextPaymentDate) : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Payment Amount</span>
                            <span className="font-semibold">{formatCurrency(305)}</span>
                            {/* loan.paymentAmount || calculateMonthlyPayment(loan.amount, loan.interestRate, loan.termMonths) */}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Term</p>
                            <p className="font-medium">
                              {loan.termMonths} months ({Math.floor(loan.termMonths / 12)} years)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Interest Rate</p>
                            <p className="font-medium">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">{formatDate(loan.date)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payoff Progress</p>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-bank-primary"
                                style={{ width: "27.5%" }}
                              ></div>
                              {/* width: `${Math.round(100 - ((loan.remainingBalance || loan.amount) / loan.amount * 100))}%` */}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              27.5% paid off
                            </p>
                            {/* {Math.round(100 - ((loan.remainingBalance || loan.amount) / loan.amount * 100))} */}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline">
                            View Details
                          </Button>
                          <Button variant="default" className="bg-bank-primary hover:bg-bank-secondary">
                            Make a Payment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            {isLoadingData ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary"></div>
              </div>
            ) : applications.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Book className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No applications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't applied for any loans yet
                    </p>
                    <Button
                      className="mt-6 bg-bank-primary hover:bg-bank-secondary"
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for a Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Loan Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{app.type}</h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Amount</p>
                              <p className="font-medium">{formatCurrency(app.amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Term</p>
                              <p className="font-medium">{app.termMonths || app.term} months</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Application Date</p>
                              <p className="font-medium">{formatDate(app.date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 w-full md:w-auto">
                          {app.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                className="flex-1 md:flex-none"
                                onClick={() => handleCancelApplication(app.id)}
                                disabled={loading}  // Optional: disable during operation
                              >
                                {loading ? "Cancelling..." : "Cancel"}
                              </Button>
                              <Button
                                className="bg-bank-primary hover:bg-bank-secondary flex-1 md:flex-none"
                              >
                                View Details <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {app.status.toLowerCase() === "approved" && (
                            <Button
                              className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                            >
                              Accept Offer <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          {app.status.toLowerCase() === "rejected" && (
                            <Button
                              className="bg-bank-primary hover:bg-bank-secondary flex-1 md:flex-none"
                              onClick={() => setActiveTab("apply")}
                            >
                              Apply Again
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Loan Information Cards */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Loan Eligibility</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  To be eligible for our loans, you need to meet the following requirements:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Be at least 18 years old</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Have a valid ID or passport</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Have a steady source of income</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maintain a good credit history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Important Information</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Before applying for a loan, please consider the following:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Interest rates may vary based on your credit score</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Early repayment may incur additional fees</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Late payments will affect your credit score</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Loan approval is subject to credit assessment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Application Process</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Here's what to expect after submitting your application:
                </p>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bank-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Application Review</p>
                      <p className="text-sm text-gray-500">1-2 business days</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bank-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Credit Assessment</p>
                      <p className="text-sm text-gray-500">2-3 business days</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bank-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Decision & Offer</p>
                      <p className="text-sm text-gray-500">1 business day</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bank-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Disbursement</p>
                      <p className="text-sm text-gray-500">1-2 business days after acceptance</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPage;