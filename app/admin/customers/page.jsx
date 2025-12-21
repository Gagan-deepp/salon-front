import { CreateCustomerDialog } from "@/components/admin/customer/create-customer-dialog"
import { CustomerTable } from "@/components/admin/customer/customer-table"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { Button } from "@/components/ui/button"
import { getCustomers } from "@/lib/actions/customer_action"
import { Plus } from 'lucide-react'
import { Suspense } from "react"

async function CustomerList({ searchParams }) {

  const searchP = await searchParams

  const params = {
    page: searchP.page || 1,
    limit: searchP.limit || 30,
    search: searchP.search || "",
    gender: searchP.gender || "",
    isActive: searchP.isActive || true,
  }

  const result = await getCustomers(params)

  const customers = result.data.data.customers
  const pagination = result.data.data.pagination

  return <CustomerTable
    customers={customers}
    pagination={
      {
        page: searchP.page ? parseInt(searchP.page) : 1,
        limit: searchP.limit ? parseInt(searchP.limit) : 10,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 0,
      }
    } />;
}

export default function CustomersPage({ searchParams }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <CreateCustomerDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </CreateCustomerDialog>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CustomerList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
