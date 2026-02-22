"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getUsersKittySummary } from "@/lib/actions/package_actions";
import { Users, Coins, Trophy, BookOpen } from "lucide-react";

export default function KittyAnalyticsPage() {
  const [report, setReport] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIXED: Fetch kitty summary data
  const fetchKittySummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getUsersKittySummary({
        year: selectedYear,
        month: selectedMonth,
      });

      console.log('result',result)
      if (result.success) {
        // Transform the response to match expected structure
        setReport({
          summary: {
            employeesWithKittyThisMonth: result.data.data.employees?.length || 0,
            totalKittyThisMonth: result.data.data.employees?.reduce((sum, u) => sum + u.monthKitty, 0) || 0,
          
            topEarner: result.data.data.employees?.[0] || null,
          },
          employees: result.data.data.employees || [],
          filter: {
            monthName: months.find(m => m.value === selectedMonth)?.label || selectedMonth,
            year: parseInt(selectedYear),
          }
        });
      } else {
        setError(result.error || "Failed to fetch kitty summary");
        setReport(null);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error("Kitty summary error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  // ✅ FIXED: Load data on mount and filter change
  useEffect(() => {
    fetchKittySummary();
  }, [fetchKittySummary]);

  // ✅ FIXED: Manual refresh
  const handleRefresh = () => {
    fetchKittySummary();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = ["2025", "2026", "2027"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kitty Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track provider earnings by month
          </p>
        </div>

        {/* Month/Year Filter */}
        <div className="flex gap-2 items-center">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees with Kitty</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.summary.employeesWithKittyThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">Active earners this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total {report.filter.monthName} Kitty</CardTitle>
              <Coins className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(report.summary.totalKittyThisMonth)}
              </div>
              <p className="text-xs text-muted-foreground">Combined kitty earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Earner</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {report.summary.topEarner?.name || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {report.summary.topEarner ? formatCurrency(report.summary.topEarner.monthKitty) : "No data"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Providers Ranking</h2>
          <p className="text-sm text-muted-foreground">
            Kitty earnings breakdown by provider
          </p>
        </div>
        {/* Selected User Card */}
        {/* <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Selected Provider</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : selectedUserId && report?.employees?.find(u => u._id === selectedUserId) ? (
              (() => {
                const selectedUser = report.employees.find(u => u._id === selectedUserId);
                return (
                  <>
                    <div className="text-4xl font-bold text-green-600 mb-4">
                      {formatCurrency(selectedUser.monthKitty)}
                    </div>
                    <p className="text-xl text-muted-foreground mb-6">
                      {report.filter.monthName} {selectedYear}
                    </p>
                    <div className="space-y-3 text-sm divide-y divide-border">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Total Lifetime:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedUser.totalLifetimeKitty || selectedUser.totalKitty)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Name:</span>
                        <span className="font-semibold">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Designation:</span>
                        <span>{selectedUser.designation}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Franchise:</span>
                        <span className="font-medium">{selectedUser.franchise}</span>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-2xl mb-2">👆</div>
                <p>Select a provider from the table</p>
                <p className="text-sm mt-1 opacity-75">Click any row to view details</p>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Kitty Report Table */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-2">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              <p className="text-muted-foreground text-center py-12">Loading providers...</p>
            ) : !report || (report.employees?.length === 0 && !loading) ? (
              <p className="text-muted-foreground text-center py-12">
                No kitty data found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </p>
            ) : (
                <div className="space-y-6">
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader className="bg-primary">
                        <TableRow>
                          <TableHead className="text-white font-bold min-w-[150px]">Provider</TableHead>
                          <TableHead className="text-white min-w-[120px]">Designation</TableHead>
                          <TableHead className="text-white min-w-[150px]">Franchise</TableHead>
                          <TableHead className="text-white text-center min-w-[150px]">
                            {months.find(m => m.value === selectedMonth)?.label} Kitty
                          </TableHead>
                          <TableHead className="text-white text-center min-w-[150px]">Total Kitty</TableHead>
                          <TableHead className="text-white text-center min-w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.employees.map((user, index) => (
                          <TableRow
                            key={user._id}
                          className={`cursor-pointer transition-all ${selectedUserId === user._id 
                              ? 'bg-blue-50 ring-1 ring-blue-300'
                              : index % 2 === 0 ? 'bg-muted' : 'bg-gray-300'
                            }`}
                          onClick={() => setSelectedUserId(user._id)}
                        >
                          <TableCell className="font-semibold">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white/50">{user.designation}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="max-w-[200px] truncate">
                              {user.franchise || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-bold text-emerald-600">
                            {formatCurrency(user.monthKitty)}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {formatCurrency(user.totalLifetimeKitty || user.totalKitty)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={selectedUserId === user._id ? "default" : "secondary"}
                              className="cursor-pointer hover:scale-105 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(user._id);
                              }}
                            >
                              {selectedUserId === user._id ? "✓ Selected" : "Select"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}

                        {/* Total Row */}
                        <TableRow className="bg-primary font-bold hover:bg-primary">
                          <TableCell className="text-white">Total</TableCell>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell className="text-white text-center text-lg">
                            {formatCurrency(report.summary.totalKittyThisMonth)}
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* How to Read This Section */}
                  <div className="rounded-lg border bg-muted/50 p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <BookOpen /> How to Read This
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5 text-emerald-600">▲</span>
                        <span><strong>Month Kitty:</strong> The kitty earned by each provider for the selected month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">→</span>
                        <span><strong>Total Kitty:</strong> Lifetime accumulated kitty across all months</span>
                      </li>
                    </ul>
                  </div>
              </div>
        )}
      </div>
    </div>
  );
}
