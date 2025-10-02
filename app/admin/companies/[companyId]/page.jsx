import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCompany } from "@/lib/actions/company_action"
import { CompanyDetails } from "@/components/admin/company/company-details"
import { CompanyDetailsSkeleton } from "@/components/admin/company/company-details-skeleton"

async function CompanyData({ companyId }) {
  try {
    console.log("🔍 Fetching company data for:", companyId)
    
    
    const result = await getCompany(companyId)
    
    console.log("📊 Company API result:", result)
    
    if (!result.success || !result.data) {
      console.error("❌ Company not found or API error:", result.error)
      notFound()
    }

    const company = result.data.data
    console.log("✅ Company data loaded:", company.name)

    return <CompanyDetails company={company} />
  } catch (error) {
    console.error("❌ Error loading company:", error)
    notFound()
  }
}

export default function CompanyPage({ params }) {
  console.log("🎯 Company page params:", params)
  
  return (
    <div className="p-6">
      <Suspense fallback={<CompanyDetailsSkeleton />}>
        <CompanyData companyId={params.companyId} />
      </Suspense>
    </div>
  )
}

// Optional: Add metadata generation
export async function generateMetadata({ params }) {
  const companyId = params.Id
  
  try {
    const result = await getCompany(companyId)
    
    if (result.success && result.data) {
      return {
        title: `${result.data.name} - Company Details`,
        description: `View details for ${result.data.name} (${companyId})`
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
