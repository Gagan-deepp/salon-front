import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RefreshCcw, Mail, Calendar, DollarSign, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Refund & Cancellation Policy | Rynox",
  description: "Refund and Cancellation Policy for our subscription-based services",
}

export default function RefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <RefreshCcw className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Refund & Cancellation Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-emerald-100">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-xl">
          <CardContent className="p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This Refund and Cancellation Policy outlines our general approach toward subscription payments, 
                    renewals, cancellations, or refund situations related to our software and associated services. 
                    The content below is intended as a broad guideline and may be interpreted or applied differently 
                    depending on specific cases or internal assessments.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Subscription Model */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Model</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our software operates on a subscription-based model, and charges may be processed at intervals 
                    based on the plan chosen by the user. Since access to the platform is typically granted immediately 
                    upon purchase, users are encouraged to fully explore and evaluate the service during their initial 
                    usage period.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Refund Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Refund requests may be reviewed individually. While refunds are not guaranteed due to the nature 
                of digital and cloud-based services, we may consider them in genuine cases such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Unresolved technical issues preventing platform usage</li>
                <li>Billing irregularities or duplicate charges</li>
                <li>Other unique circumstances requiring individual assessment</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                <p className="text-amber-900 font-semibold mb-2">Important Notice</p>
                <p className="text-amber-800 text-sm">
                  The approval, partial approval, or denial of any refund may depend on various factors including 
                  internal review, service usage patterns, and technical verification.
                </p>
              </div>
            </section>

            <Separator />

            {/* Cancellation Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Cancellation Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Users may cancel their subscription at any time through their account settings or by reaching out 
                to our support team. In most cases, subscription access continues until the end of the active 
                billing cycle following cancellation.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
                <p className="text-blue-900 font-semibold mb-2">Please Note</p>
                <p className="text-blue-800 text-sm">
                  Refunds for unused time within a billing period are not typically provided, though exceptions 
                  may be considered based on internal discretion.
                </p>
              </div>
            </section>

            <Separator />

            {/* Payment Issues */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Payment Processing Issues</h2>
              <p className="text-gray-700 leading-relaxed">
                If a scheduled payment is unsuccessful, access to some or all platform features may be temporarily 
                restricted. The conditions and duration of such restrictions may vary depending on operational 
                requirements.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Users are encouraged to ensure their payment information remains current to avoid service interruptions.
              </p>
            </section>

            <Separator />

            {/* Policy Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to update or modify this policy at any time. Such changes take effect upon 
                being posted to our website or platform, and continued use of the service constitutes acceptance 
                of these terms.
              </p>
            </section>

            <Separator />

            {/* Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For queries related to cancellations or refunds, users may contact us at:
              </p>
              <a 
                href="mailto:rynox0001@gmail.com"
                className="inline-flex items-center gap-2 text-primary"
              >
                <Mail className="w-5 h-5" />
                rynox0001@gmail.com
              </a>
            </section>
          </CardContent>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a 
            href="/"
            className="text-primary font-medium hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
