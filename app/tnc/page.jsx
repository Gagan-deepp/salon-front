import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, ArrowLeftCircle, Shield, AlertTriangle, MapPin, Phone, Mail, Globe, Info } from "lucide-react"

export const metadata = {
  title: "Terms & Conditions | RYY-NOX",
  description: "Terms & Conditions for using the RYY-NOX salon management and billing platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - matching Contact page style */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Terms &amp; Conditions
          </h1>
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">Last Updated: Dec, 2025</p>
          </div>
          <p className="text-center mt-4 text-blue-50 max-w-2xl mx-auto">
            Welcome to RYY-NOX, a cloud-based salon management and billing software developed and maintained by Vicino Tech.
            These Terms &amp; Conditions govern your use of our platform, applications, and related digital services.
          </p>
        </div>
      </div>

      {/* Content - matching Contact page structure */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-xl">
          <CardContent className="p-8 md:p-12 space-y-8">
            {/* 1. Introduction & Acceptance */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction &amp; Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using the RYY-NOX Platform in any capacity, you confirm that you have read, understood, and
                    agreed to these Terms. These Terms form a binding contract between you and Vicino Tech and apply to all
                    modules including billing, booking, inventory, CRM, subscriptions, staff tracking, analytics, and integrations.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                    <li>You are responsible for ensuring that all users in your salon (admin, staff, manager, reception) follow these Terms.</li>
                    <li>You have the authority to bind the salon or business you represent.</li>
                    <li>Your use of the Platform complies with all applicable laws in India.</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* 2. Eligibility */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">2. Eligibility to Use the Platform</h2>
              <p className="text-gray-700 leading-relaxed">
                To access and use RYY-NOX, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Be 18 years or older.</li>
                <li>Have the legal capacity to operate a business or represent one.</li>
                <li>Provide accurate information during registration and onboarding.</li>
                <li>Not be prohibited by law from using digital or financial services.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Vicino Tech reserves the right to deny or terminate access if eligibility criteria are violated.
              </p>
            </section>

            <Separator />

            {/* 3. Account Registration */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">3. Account Registration &amp; User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed">
                To use RYY-NOX, you must create an account with accurate business details (name, salon location, GST, staff roles, etc.).
                Once registered, you are responsible for all activity under your account.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">3.1 Safeguarding Login Credentials</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Keep your username, password, and PIN confidential.</li>
                <li>Ensure only authorized staff have access to admin-level features.</li>
                <li>Update passwords regularly for security.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">3.2 Account Activities</h3>
              <p className="text-gray-700 leading-relaxed">
                You are accountable for billing entries, bookings, staff check-ins, and customer data added through your account.
                We may suspend accounts involved in suspicious or fraudulent activities.
              </p>
            </section>

            <Separator />

            {/* 4. Subscription & Billing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">4. Subscription Plans, Billing &amp; Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                RYY-NOX operates on a subscription-based model with plans that vary by features and usage. All payments are processed
                securely via third-party gateways such as Razorpay.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">4.1 Subscription Billing</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Fees are payable upfront on a monthly, quarterly, or annual basis.</li>
                <li>Plans may auto-renew unless cancelled before the renewal date.</li>
                <li>Invoices and receipts are generated for every successful payment.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">4.2 Payment Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                Payments are handled by secure third-party providers. RYY-NOX does not store card or sensitive payment details.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">4.3 Non-Payment or Late Payment</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access to premium features may be restricted.</li>
                <li>Accounts may be temporarily deactivated until dues are cleared.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">4.4 Price Changes</h3>
              <p className="text-gray-700 leading-relaxed">
                Pricing may be updated in the future. You will be informed in advance where commercially reasonable.
              </p>
            </section>

            <Separator />

            {/* 5. Use of Platform */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">5. Use of the Platform – Permissions &amp; Restrictions</h2>
              <p className="text-gray-700 leading-relaxed">
                RYY-NOX grants you a limited, non-transferable license to use the Platform solely to operate your salon or business.
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Misuse, damage, or tamper with the software.</li>
                <li>Reverse-engineer, copy, or resell the Platform.</li>
                <li>Attempt unauthorized access to systems or databases.</li>
                <li>Upload malware, malicious scripts, or harmful code.</li>
                <li>Use the Platform for illegal or fraudulent activities.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Usage may be monitored for security, fraud detection, and compliance purposes.
              </p>
            </section>

            <Separator />

            {/* 6. Data */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">6. Data Storage, Processing &amp; Ownership</h2>
              <p className="text-gray-700 leading-relaxed">
                RYY-NOX manages and stores salon data including billing, customer profiles, packages, staff details, inventory, and reports.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">6.1 Data Ownership</h3>
              <p className="text-gray-700 leading-relaxed">
                All business and customer data belongs to your salon or business. RYY-NOX only processes, structures, and displays this data.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">6.2 Data Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Ensuring data accuracy during entry.</li>
                <li>Maintaining backups where needed.</li>
                <li>Obtaining customer consent before storing their information.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">6.3 Data Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We adopt reasonable technical and organizational measures such as encryption, secure servers, and access control.
              </p>
            </section>

            <Separator />

            {/* 7. Third-party integrations */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">7. Third-Party Integrations</h2>
              <p className="text-gray-700 leading-relaxed">
                RYY-NOX may integrate with payment gateways, SMS providers, WhatsApp Business APIs, email services, and cloud backups.
                We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Downtime or outages on third-party platforms.</li>
                <li>Errors originating from third-party APIs.</li>
                <li>Fees and charges imposed by third-party providers.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You must comply with each third-party service&apos;s terms and policies.
              </p>
            </section>

            <Separator />

            {/* 8. Availability & Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">8. Software Availability &amp; Updates</h2>
              <h3 className="font-semibold text-gray-900">8.1 Service Availability</h3>
              <p className="text-gray-700 leading-relaxed">
                While we aim for high uptime, RYY-NOX may be temporarily unavailable due to maintenance, upgrades, or issues beyond our control.
                We will attempt to provide prior notice for planned maintenance.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">8.2 Updates &amp; Improvements</h3>
              <p className="text-gray-700 leading-relaxed">
                Updates may be released to add features, fix bugs, and improve performance. These may be deployed automatically without prior notice.
              </p>
            </section>

            <Separator />

            {/* 9. IP Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">9. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                All intellectual property in RYY-NOX, including software code, UI design, workflows, documentation, branding, and trademarks,
                belongs exclusively to Vicino Tech.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not modify, reproduce, resell, or distribute any part of the Platform, nor use the RYY-NOX brand without explicit permission.
              </p>
            </section>

            <Separator />

            {/* 10. Packages & Redemption */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">10. Salon Package &amp; Redemption System</h2>
              <h3 className="font-semibold text-gray-900">10.1 Selling a Package</h3>
              <p className="text-gray-700 leading-relaxed">
                When a customer purchases a package, they pay a lump sum and the amount is recorded as Package Sale Revenue. The system converts
                this into a redeemable balance for future use.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">10.2 Redemption During Billing</h3>
              <p className="text-gray-700 leading-relaxed">
                During each visit, services or products consumed are auto-mapped and deducted from the package balance. If applicable, GST
                treatment is handled by the system configuration.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">10.3 Revenue Reflection</h3>
              <p className="text-gray-700 leading-relaxed">
                Package purchases and redemptions are reflected separately for reporting:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Package Sale Revenue – at the time of purchase.</li>
                <li>Service Redemption Value – when services are consumed.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">10.4 Package Expiry</h3>
              <p className="text-gray-700 leading-relaxed">
                If a package has an expiry date, RYY-NOX automatically marks it as expired after that date. Expired balances become non-redeemable
                unless your internal policy allows a manual override.
              </p>
            </section>

            <Separator />

            {/* 11. Refunds & Cancellations */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">11. Refunds, Cancellations &amp; Expiration</h2>
              <h3 className="font-semibold text-gray-900">11.1 Subscription Refunds</h3>
              <p className="text-gray-700 leading-relaxed">
                As RYY-NOX is a digital subscription service, payments are generally non-refundable. Limited exceptions may be considered in case
                of severe technical issues.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">11.2 Customer Package Refunds (Salon Responsibility)</h3>
              <p className="text-gray-700 leading-relaxed">
                If your salon decides to refund a customer&apos;s package, this is entirely your business decision. RYY-NOX does not refund your
                end customers on your behalf.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">11.3 Subscription Cancellation</h3>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your RYY-NOX subscription at any time. Access generally continues until the end of the current billing cycle.
              </p>
            </section>

            <Separator />

            {/* 12. Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">12. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, RYY-NOX and Vicino Tech are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Loss of business, revenue, profit, or reputation.</li>
                <li>Incorrect data entered by your team.</li>
                <li>Fraud or misconduct within the salon.</li>
                <li>Issues caused by third-party services or APIs.</li>
                <li>Service interruptions beyond our reasonable control.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Our total liability, if any, is limited to subscription fees paid for the Platform in the last three months.
              </p>
            </section>

            <Separator />

            {/* 13. Indemnification */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">13. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless RYY-NOX and Vicino Tech from claims, damages, or losses arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Misuse of the Platform.</li>
                <li>Violation of these Terms.</li>
                <li>Unlawful or incorrect business practices.</li>
                <li>Data misuse or errors by your staff.</li>
                <li>Issues triggered by your third-party integrations.</li>
              </ul>
            </section>

            <Separator />

            {/* 14. Termination */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">14. Termination of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate your access to RYY-NOX if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You violate these Terms.</li>
                <li>Fraudulent or illegal activity is detected.</li>
                <li>Payments are not received as per plan.</li>
                <li>The Platform is abused, attacked, or tampered with.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Upon termination, access to your data may be restricted. Data export may be provided on request within reasonable timelines,
                subject to policy.
              </p>
            </section>

            <Separator />

            {/* 15. Changes to Terms */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">15. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms may be updated periodically to reflect regulatory changes, product improvements, or operational needs.
                Continued use of RYY-NOX after such updates implies acceptance of the revised Terms.
              </p>
            </section>

            <Separator />

            {/* 16. Law & Jurisdiction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">16. Governing Law &amp; Jurisdiction</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in Mumbai,
                Maharashtra.
              </p>
            </section>

            <Separator />

            {/* 17. Contact Info */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">17. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions, clarifications, or support related to these Terms or to RYY-NOX:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Location */}
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Location</h3>
                  </div>
                  <p className="text-gray-700">
                    3rd Floor, 5 Convent Street<br/>
                    Colaba, Mumbai 400001
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Phone Number</h3>
                  </div>
                  <p className="text-gray-700 font-mono text-lg">+91 7977120544</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Email</h3>
                  </div>
                  <a 
                    href="mailto:RYY-NOX0001@gmail.com"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    RYY-NOX0001@gmail.com
                  </a>
                </div>

                {/* Developer Info */}
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Developed By</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    This product is developed and maintained by <strong>Vicino Tech</strong>.
                  </p>
                  <a 
                    href="https://vicinotech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    vicinotech.com
                  </a>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-primary font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
