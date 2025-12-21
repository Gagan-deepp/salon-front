import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCompany } from "@/lib/actions/company_action"
import { CompanyDetails } from "@/components/admin/company/company-details"
import { CompanyDetailsSkeleton } from "@/components/admin/company/company-details-skeleton"

async function CompanyData({ id }) {
  try {
    console.log("🔍 Loading company:", id)
    const result = await getCompany(id)
    
    if (!result.success || !result.data) {
      console.log("❌ Company not found")
      notFound()
    }

    const company = result.data.data
    console.log("✅ Company loaded:", company.name)
    return <CompanyDetails company={company} />
  } catch (error) {
    console.error("❌ Error loading company:", error)
    notFound()
  }
}

// ✅ Next.js 15: params is a Promise - AWAIT IT!
export default async function CompanyPage({ params }) {
  // Await params to get the id
  const { id } = await params
  
  console.log("🎯 Company ID:", id)
  
  return (
    <div className="p-6">
      <Suspense fallback={<CompanyDetailsSkeleton />}>
        <CompanyData id={id} />
      </Suspense>
    </div>
  )
}

// ✅ Metadata also needs to await params
export async function generateMetadata({ params }) {
  const { id } = await params
  
  try {
    const result = await getCompany(id)
    
    if (result.success && result.data) {
      const company = result.data.data
      return {
        title: `${company.name} - Company Details`,
        description: `View details for ${company.name}`
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }
  
  return {
    title: "Company Details",
    description: "View company information"
  }
}
