import Header from "@/components/homepage/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Calendar, FileText, Info } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | RYY-NOX",
  description: "Privacy Policy describing how we collect, handle, store, and use information",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
   <>
   {/* <Header/> */}
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-blue-100">
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
                <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This Privacy Policy describes the manner in which we may collect, handle, store, use, 
                    or disclose information in relation to the use of our software, website, or any related 
                    digital service. By accessing or using any part of our platform, users acknowledge that 
                    they have read and understood this policy and agree to its general framework.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Information Collection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Information Collection</h2>
              <p className="text-gray-700 leading-relaxed">
                We may collect various types of information depending on how users interact with our software. 
                This may include information voluntarily provided during:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Account creation</li>
                <li>Communication with our platform</li>
                <li>Payment processing</li>
                <li>Onboarding procedures</li>
                <li>General platform usage</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Certain data may also be automatically collected through system interactions, device behaviour, 
                cookies, usage tracking tools, or general analytics. The types and extent of information collected 
                can vary and may evolve over time based on technical, operational, or security requirements.
              </p>
            </section>

            <Separator />

            {/* Information Usage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">How We Use Information</h2>
              <p className="text-gray-700 leading-relaxed">
                The information collected may be used for several internal purposes, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Enabling platform functionality</li>
                <li>Improving system performance</li>
                <li>Enhancing user experience</li>
                <li>Supporting service delivery</li>
                <li>Maintaining platform reliability</li>
                <li>Addressing technical issues</li>
                <li>Facilitating communication</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We may also utilise aggregated or non-identifiable information for analysis, upgrades, research, 
                quality control, or operational optimisation.
              </p>
            </section>

            <Separator />

            {/* Third-Party Services */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                At times, we may engage third-party providers for services such as hosting, payment processing, 
                communication, analytics, or technical support. These entities may have limited access to certain 
                information solely to perform specific functions and are generally expected to maintain confidentiality 
                and adopt reasonable safeguards.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
                <p className="text-blue-900 font-semibold">
                  Important: We do not sell personal data.
                </p>
              </div>
            </section>

            <Separator />

            {/* Data Retention */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                Information may be retained for durations required for operational continuity, legal compliance, 
                internal documentation, dispute resolution, or other legitimate business needs. Data deletion 
                timelines can vary depending on technical and administrative factors.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Users may contact us with requests to access, revise, or remove certain information, and such 
                requests will be evaluated based on practical, operational, and regulatory considerations.
              </p>
            </section>

            <Separator />

            {/* External Links */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">External Links & Integrations</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services may contain integrations or links to external platforms, and we are not responsible 
                for their content or practices. Users are encouraged to review the policies of third-party services 
                independently.
              </p>
            </section>

            <Separator />

            {/* Policy Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy may be updated periodically, and such revisions will generally become effective 
                upon being posted. Continued use of the platform indicates acceptance of these updates.
              </p>
            </section>

            <Separator />

            {/* Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions regarding this policy, users may contact us at:
              </p>
              <a 
                href="mailto:rynox0001@gmail.com"
                className="inline-flex items-center gap-2 text-primary  font-medium"
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
    </>
  )
}
