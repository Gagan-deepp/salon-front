"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { amountToWords } from "@/lib/utils"


export function InvoiceDownloadButton({
    customerInfo,
    sellerInfo,
    orderDetails,
    items,
    companyLogo,
    discount = { percentage: 0, amount: 0 },
    notes,
}) {
    const pdfRef = useRef(null)

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0
        let totalGst = 0

        items.forEach((item) => {
            const itemPrice = item.price * item.quantity
            subtotal += itemPrice
            const gst = (itemPrice * item.gstRate) / 100
            totalGst += gst
        })

        const discountAmount = discount.amount || (subtotal * discount.percentage) / 100
        const taxableAmount = subtotal - discountAmount
        const finalAmount = taxableAmount + totalGst

        return {
            subtotal,
            discount: discountAmount,
            taxableAmount,
            totalGst,
            finalAmount,
        }
    }

    const totals = calculateTotals()

    const downloadPDF = async () => {
        if (!pdfRef.current) return

        try {
            const element = pdfRef.current

            // Move element into viewport FIRST
            element.style.position = 'fixed'
            element.style.top = '0'
            element.style.left = '0'
            element.style.zIndex = '-1000'
            element.style.width = '210mm'
            element.style.height = 'auto'
            element.style.overflow = 'visible'
            element.style.backgroundColor = '#ffffff'
            element.style.padding = '2rem'

            // Wait longer for styles to compute and render
            await new Promise(resolve => setTimeout(resolve, 300))

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: "#ffffff",
                windowWidth: 794,
                windowHeight: element.scrollHeight,
            })

            // Move back offscreen
            element.style.position = 'absolute'
            element.style.left = '-9999px'

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF("p", "mm", "a4")
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio)

            // Handle multi-page
            let heightLeft = imgHeight * ratio - pdfHeight
            let position = -pdfHeight

            while (heightLeft > 0) {
                pdf.addPage()
                pdf.addImage(imgData, "PNG", 0, position, imgWidth * ratio, imgHeight * ratio)
                position -= pdfHeight
                heightLeft -= pdfHeight
            }

            pdf.save(`invoice-${orderDetails.invoiceNumber}.pdf`)
        } catch (error) {
            console.error("Error generating PDF:", error)
        }
    }


    const termsConditions = [
        "We encourage you to raise any concerns on the customer care number or email ID mentioned above.",
        "Any issue arising from a service delivered by us should be reported within 48 hours of completion.",
        "If you wish to return a product, it will be accepted within seven days of the date of purchase.",
    ]

    return (
        <>
            <div ref={pdfRef}
                className="bg-white p-8 space-y-6"  // Add Tailwind classes back
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                    width: "210mm",
                    backgroundColor: "#ffffff",  // Backup inline style
                    padding: "2rem",  // Backup inline style
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-8">
                    <div className="space-y-2">
                        {companyLogo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={companyLogo || "/placeholder.svg"} alt="Company Logo" className="h-12 w-auto" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{sellerInfo.companyName}</h1>
                            <p className="text-sm text-gray-600">{sellerInfo.address}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800">TAX INVOICE</h2>
                    </div>
                </div>

                <hr className="border-t-2 border-gray-300" />

                {/* Customer and Seller Info */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Sold/Served To */}
                    <div className="space-y-3">
                        <div className="bg-gray-200 p-2 font-bold text-sm">SOLD/SERVED TO:</div>
                        <div className="text-sm space-y-1">
                            <p>
                                <span className="font-semibold">Name:</span> {customerInfo.name}
                            </p>
                            <p>
                                <span className="font-semibold">Phone Number:</span> {customerInfo.phoneNumber}
                            </p>
                            <p>
                                <span className="font-semibold">Mode Of Payment:</span> {customerInfo.modeOfPayment}
                            </p>
                            <p>
                                <span className="font-semibold">Place Of Supply:</span> {customerInfo.placeOfSupply}
                            </p>
                            <p>
                                <span className="font-semibold">Place Of Delivery:</span> {customerInfo.placeOfDelivery}
                            </p>
                        </div>
                    </div>

                    {/* Sold/Served By */}
                    <div className="space-y-3">
                        <div className="bg-gray-200 p-2 font-bold text-sm">SOLD/SERVED BY:</div>
                        <div className="text-sm space-y-1">
                            <p className="font-semibold">{sellerInfo.companyName}</p>
                            <p>{sellerInfo.address}</p>
                            {sellerInfo.additionalAddress && <p>{sellerInfo.additionalAddress}</p>}
                            <p>{sellerInfo.city}</p>
                            <p>
                                <span className="font-semibold">Phone Number:</span> {sellerInfo.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-200 p-2 font-bold text-sm">ORDER DETAILS:</div>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div className="space-y-1">
                        <p>
                            <span className="font-semibold">Order Number:</span> {orderDetails.orderNumber}
                        </p>
                        <p>
                            <span className="font-semibold">Order Date:</span> {orderDetails.orderDate}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p>
                            <span className="font-semibold">Invoice Number:</span> {orderDetails.invoiceNumber}
                        </p>
                        <p>
                            <span className="font-semibold">Invoice Date:</span> {orderDetails.invoiceDate}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p>
                            <span className="font-semibold">GST Number:</span> {orderDetails.gstNumber}
                        </p>
                        <p>
                            <span className="font-semibold">PAN Number:</span> {orderDetails.panNumber}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p>
                            <span className="font-semibold">CIN Number:</span> {orderDetails.cinNumber}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">  {/* Changed to text-xs */}
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="border border-gray-300 px-1 py-1 text-left font-semibold text-[9px]">Item</th>
                                <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-[9px]">HSN</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Price</th>
                                <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-[9px]">Qty</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Total</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Disc</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Net</th>
                                <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-[9px]">Type</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">GST%</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Tax</th>
                                <th className="border border-gray-300 px-1 py-1 text-right font-semibold text-[9px]">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const itemPrice = item.price * item.quantity
                                const taxAmount = (itemPrice * item.gstRate) / 100
                                const netAmount = itemPrice - (discount.amount / items.length || 0)

                                return (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="border border-gray-300 p-2">
                                            {"productName" in item ? item.productName : item.serviceName}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center">-</td>
                                        <td className="border border-gray-300 p-2 text-right">₹{item.price.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                                        <td className="border border-gray-300 p-2 text-right">₹{itemPrice.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-right">-</td>
                                        <td className="border border-gray-300 p-2 text-right">₹{netAmount.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-center">GST</td>
                                        <td className="border border-gray-300 p-2 text-right">{item.gstRate}%</td>
                                        <td className="border border-gray-300 p-2 text-right">₹{taxAmount.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-right font-semibold">
                                            ₹{(netAmount + taxAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mt-6">
                    <div className="w-80 space-y-2 text-sm">
                        <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                            <span className="font-semibold">Subtotal:</span>
                            <span>₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        {totals.discount > 0 && (
                            <div className="flex justify-between">
                                <span className="font-semibold">Discount:</span>
                                <span>-₹{totals.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="font-semibold">Taxable Amount:</span>
                            <span>₹{totals.taxableAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">GST (9% + 9%):</span>
                            <span>₹{totals.totalGst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between bg-gray-100 p-2 border-t-2 border-gray-300 pt-2 font-bold text-base">
                            <span>Total Amount:</span>
                            <span>₹{totals.finalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Amount in Words */}
                <div className="mt-4 text-sm">
                    <p>
                        <span className="font-semibold">Amount in words:</span> {amountToWords(totals.finalAmount)}
                    </p>
                </div>

                {/* Signature Section */}
                <div className="flex justify-end mt-8">
                    <div className="text-center">
                        <div className="h-12 w-24 border-t border-gray-400 mt-4"></div>
                        <p className="text-sm font-semibold mt-2">Authorized Signatory</p>
                    </div>
                </div>

                {/* Notes */}
                {notes && (
                    <div className="mt-6 p-4 bg-gray-50 text-sm">
                        <p className="font-semibold mb-2">Additional Notes:</p>
                        <p>{notes}</p>
                    </div>
                )}

                {/* Terms and Conditions */}
                {termsConditions && termsConditions.length > 0 && (
                    <div className="mt-6 pt-4 border-t-2 border-gray-300 text-xs">
                        <p className="font-semibold mb-2">Terms and Conditions:</p>
                        <ul className="space-y-1">
                            {termsConditions.map((term, idx) => (
                                <li key={idx}>
                                    {idx + 1}. {term}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Button onClick={downloadPDF} variant="default" size="sm">
                Download Invoice
            </Button>
        </>
    )
}