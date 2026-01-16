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
          <h1 className="text-3xl font-bold tracking-tight">Kitty Analytics</h1>
          <p className="text-muted-foreground">
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
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {report.summary.employeesWithKittyThisMonth}
              </div>
              <p className="text-sm text-muted-foreground">
                Employees with Kitty
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatCurrency(report.summary.totalKittyThisMonth)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total {report.filter.monthName} Kitty
              </p>
            </CardContent>
          </Card>
          
          {/* <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {formatCurrency(report.summary.averageKittyPerEmployee)}
              </div>
              <p className="text-sm text-muted-foreground">Avg per Employee</p>
            </CardContent>
          </Card>
           */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-bold mb-1">
                {report.summary.topEarner?.name || "N/A"}
              </div>
              <p className="text-sm text-muted-foreground">Top Earner</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Providers Ranking (
              {months.find((m) => m.value === selectedMonth)?.label} {selectedYear})
            </CardTitle>
            {report && (
              <p className="text-2xl font-bold text-green-600">
                Total: {formatCurrency(report.summary.totalKittyThisMonth)}
              </p>
            )}
          </CardHeader>
          <CardContent>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Franchise</TableHead>
                      <TableHead className="text-right">
                        {selectedMonth}/{selectedYear} Kitty
                      </TableHead>
                      <TableHead className="text-right">Total Kitty</TableHead>
                      <TableHead className="w-24">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.employees.map((user) => (
                      <TableRow
                        key={user._id}
                        className={`cursor-pointer hover:bg-muted/50 border-l-4 transition-all ${
                          selectedUserId === user._id 
                            ? 'bg-blue-50 border-l-blue-500 shadow-sm' 
                            : 'border-l-transparent hover:border-l-muted'
                        }`}
                        onClick={() => setSelectedUserId(user._id)}
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.designation}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="max-w-[200px] truncate">
                            {user.franchise || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {formatCurrency(user.monthKitty)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCurrency(user.totalLifetimeKitty || user.totalKitty)}
                        </TableCell>
                        <TableCell>
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
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
