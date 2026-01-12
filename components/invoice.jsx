"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { amountToWords } from "@/lib/utils"

export default function InvoiceDownloadButton({
    customerInfo,
    sellerInfo,
    orderDetails,
    items,
    companyLogo,
    discount = { percentage: 0, amount: 0 },
    notes,
    mode = "dev", // "dev" or "server"
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

        console.log("Items ==> ", items)
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
            <div
                id="invoice-design"
                ref={pdfRef}
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                    width: "210mm",
                    backgroundColor: "#ffffff",
                    padding: "2rem",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "32px",
                    marginBottom: "24px"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {companyLogo && (
                            <img
                                src={companyLogo || "/placeholder.svg"}
                                alt="Company Logo"
                                style={{ height: "48px", width: "auto" }}
                            />
                        )}
                        <div>
                            <h1 style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                margin: "0 0 4px 0"
                            }}>
                                {sellerInfo.companyName}
                            </h1>
                            <p style={{
                                fontSize: "14px",
                                color: "#4b5563",
                                margin: "0"
                            }}>
                                {sellerInfo.address}
                            </p>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <h2 style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#1f2121",
                            margin: "0"
                        }}>
                            TAX INVOICE
                        </h2>
                    </div>
                </div>

                <hr style={{ borderTop: "2px solid #d1d5db", borderBottom: "none", borderLeft: "none", borderRight: "none", margin: "0 0 24px 0" }} />

                {/* Customer and Seller Info */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "32px",
                    marginBottom: "24px"
                }}>
                    {/* Sold/Served To */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{
                            backgroundColor: "#d1d5db",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}>
                            SOLD/SERVED TO:
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Name:</span> {customerInfo.name}
                            </p>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Phone Number:</span> {customerInfo.phoneNumber}
                            </p>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Mode Of Payment:</span> {customerInfo.modeOfPayment}
                            </p>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Place Of Supply:</span> {customerInfo.placeOfSupply}
                            </p>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Place Of Delivery:</span> {customerInfo.placeOfDelivery}
                            </p>
                        </div>
                    </div>

                    {/* Sold/Served By */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{
                            backgroundColor: "#d1d5db",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}>
                            SOLD/SERVED BY:
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <p style={{ fontWeight: "600", margin: "0" }}>{sellerInfo.companyName}</p>
                            <p style={{ margin: "0" }}>{sellerInfo.address}</p>
                            {sellerInfo.additionalAddress && <p style={{ margin: "0" }}>{sellerInfo.additionalAddress}</p>}
                            <p style={{ margin: "0" }}>{sellerInfo.city}</p>
                            <p style={{ margin: "0" }}>
                                <span style={{ fontWeight: "600" }}>Phone Number:</span> {sellerInfo.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div style={{
                    backgroundColor: "#d1d5db",
                    padding: "8px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "16px"
                }}>
                    ORDER DETAILS:
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "32px",
                    fontSize: "14px",
                    marginBottom: "24px"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>Order Number:</span> {orderDetails.orderNumber}
                        </p>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>Order Date:</span> {orderDetails.orderDate}
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>Invoice Number:</span> {orderDetails.invoiceNumber}
                        </p>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>Invoice Date:</span> {orderDetails.invoiceDate}
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>GST Number:</span> {orderDetails.gstNumber}
                        </p>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>PAN Number:</span> {orderDetails.panNumber}
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ margin: "0" }}>
                            <span style={{ fontWeight: "600" }}>CIN Number:</span> {orderDetails.cinNumber}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div style={{
                    overflowX: "auto",
                    marginBottom: "24px"
                }}>
                    <table style={{
                        width: "100%",
                        fontSize: "12px",
                        borderCollapse: "collapse"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #d1d5db" }}>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Item
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    CODE
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Price
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Qty
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Total
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Disc
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Net
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Type
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    GST%
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Tax
                                </th>
                                <th style={{
                                    border: "1px solid #d1d5db",
                                    padding: "4px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontSize: "11px"
                                }}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const itemPrice = item.price * item.quantity
                                const taxAmount = (itemPrice * item.gstRate) / 100
                                const netAmount = itemPrice - (discount.amount / items.length || 0)

                                return (
                                    <tr key={index} style={{ borderBottom: "1px solid #d1d5db" }}>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px"
                                        }}>
                                            {"productName" in item ? item.productName : item.serviceName}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "center"
                                        }}>
                                            {"productCode" in item ? item.productCode : item.serviceCode}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            ₹{item.price.toFixed(2)}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "center"
                                        }}>
                                            {item.quantity}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            ₹{itemPrice.toFixed(2)}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            -
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            ₹{netAmount.toFixed(2)}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "center"
                                        }}>
                                            GST
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            {item.gstRate}%
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right"
                                        }}>
                                            ₹{taxAmount.toFixed(2)}
                                        </td>
                                        <td style={{
                                            border: "1px solid #d1d5db",
                                            padding: "8px",
                                            textAlign: "right",
                                            fontWeight: "600"
                                        }}>
                                            ₹{(netAmount + taxAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "24px"
                }}>
                    <div style={{
                        width: "320px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "14px"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "2px solid #d1d5db",
                            paddingBottom: "8px"
                        }}>
                            <span style={{ fontWeight: "600" }}>Subtotal:</span>
                            <span>₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        {totals.discount > 0 && (
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <span style={{ fontWeight: "600" }}>Discount:</span>
                                <span>-₹{totals.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <span style={{ fontWeight: "600" }}>Taxable Amount:</span>
                            <span>₹{totals.taxableAmount.toFixed(2)}</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <span style={{ fontWeight: "600" }}>GST (9% + 9%):</span>
                            <span>₹{totals.totalGst.toFixed(2)}</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#f3f4f6",
                            padding: "8px",
                            borderTop: "2px solid #d1d5db",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}>
                            <span>Total Amount:</span>
                            <span>₹{totals.finalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Amount in Words */}
                <div style={{
                    marginBottom: "24px",
                    fontSize: "14px"
                }}>
                    <p style={{ margin: "0" }}>
                        <span style={{ fontWeight: "600" }}>Amount in words:</span> {amountToWords(totals.finalAmount)}
                    </p>
                </div>

                {/* Signature Section */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "32px"
                }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            height: "48px",
                            width: "96px",
                            borderTop: "1px solid #9ca3af",
                            marginBottom: "16px"
                        }}></div>
                        <p style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            margin: "0"
                        }}>
                            Authorized Signatory
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {notes && (
                    <div style={{
                        marginBottom: "24px",
                        padding: "16px",
                        backgroundColor: "#f9fafb",
                        fontSize: "14px"
                    }}>
                        <p style={{
                            fontWeight: "600",
                            marginBottom: "8px",
                            margin: "0 0 8px 0"
                        }}>
                            Additional Notes:
                        </p>
                        <p style={{ margin: "0" }}>{notes}</p>
                    </div>
                )}

                {/* Terms and Conditions */}
                {termsConditions && termsConditions.length > 0 && (
                    <div style={{
                        marginTop: "24px",
                        paddingTop: "16px",
                        borderTop: "2px solid #d1d5db",
                        fontSize: "12px"
                    }}>
                        <p style={{
                            fontWeight: "600",
                            marginBottom: "8px",
                            margin: "0 0 8px 0"
                        }}>
                            Terms and Conditions:
                        </p>
                        <ul style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            margin: "0",
                            paddingLeft: "20px"
                        }}>
                            {termsConditions.map((term, idx) => (
                                <li key={idx} style={{ margin: "0" }}>
                                    {idx + 1}. {term}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Download Button - Only show in dev mode */}
            {mode === "dev" && (
                <Button onClick={downloadPDF} variant="default" size="sm">
                    Download Invoice
                </Button>
            )}
        </>
    )
}
