import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Phone, Globe, Info, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Contact Us | RYY-NOX",
  description: "Contact RYY-NOX for software, services, subscriptions, and support queries",
}

export default function ContactPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header - EXACT same structure as privacy page */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-center mb-4">
              <Info className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Contact Us
            </h1>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <p className="text-sm">For software, services, subscriptions, or support</p>
            </div>
          </div>
        </div>

        {/* Content - EXACT same structure as privacy page */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="shadow-xl">
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Introduction */}
              <section className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                    <p className="text-gray-700 leading-relaxed">
                      For any queries related to our software, services, subscriptions, or support, you can reach us through the details below. Our team will assist you with anything you need.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Contact Details */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
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
                      href="mailto:rynox0001@gmail.com"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      rynox0001@gmail.com
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

              <Separator />

              {/* Support Note */}
              <section className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                  <p className="text-blue-900 font-semibold">
                    Need immediate help? Use phone or email above. Our team responds within 24 hours.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Back to Home Link - EXACT same as privacy page */}
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
