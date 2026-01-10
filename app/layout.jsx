import { Inter, Playfair_Display, Poppins } from "next/font/google"
import "./index.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
})

export const metadata = {
  title: "RYY-NOX : Enterprise Billing Platform",
  description: "The only billing system built for franchise operations",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
