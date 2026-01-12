export default function InvoiceForServer({
    customerInfo,
    sellerInfo,
    orderDetails,
    items,
    companyLogo,
    discount = { percentage: 0, amount: 0 },
    notes,
}) {
    // Calculate totals - replicate calculation for server rendering
    let subtotal = 0;
    let totalGst = 0;

    items.forEach((item) => {
        const itemPrice = item.price * item.quantity;
        subtotal += itemPrice;
        const gst = (itemPrice * item.gstRate) / 100;
        totalGst += gst;
    });

    const discountAmount = discount.amount || (subtotal * discount.percentage) / 100;
    const taxableAmount = subtotal - discountAmount;
    const finalAmount = taxableAmount + totalGst;

    const termsConditions = [
        "We encourage you to raise any concerns on the customer care number or email ID mentioned above.",
        "Any issue arising from a service delivered by us should be reported within 48 hours of completion.",
        "If you wish to return a product, it will be accepted within seven days of the date of purchase.",
    ];

    // Utility to convert amount to words if you can replicate or hardcode for server

    return (
        <div
            id="invoice-design"
            style={{
                position: "relative",
                width: "210mm",
                backgroundColor: "#ffffff",
                padding: "2rem",
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                color: "#000",
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
                        <img src={companyLogo} alt="Company Logo" style={{ height: "48px", width: "auto" }} />
                    )}
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>
                            {sellerInfo.companyName}
                        </h1>
                        <p style={{ color: "#4b5563", margin: 0 }}>
                            {sellerInfo.address}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>TAX INVOICE</h2>
                </div>
            </div>

            <hr style={{ borderTop: "2px solid #d1d5db", marginBottom: "24px" }} />

            {/* Customer and Seller Info */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
                marginBottom: "24px"
            }}>
                <div style={{ backgroundColor: "#d1d5db", padding: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    SOLD/SERVED TO:
                    <div style={{ marginTop: "8px" }}>
                        <p><strong>Name:</strong> {customerInfo.name}</p>
                        <p><strong>Phone Number:</strong> {customerInfo.phoneNumber}</p>
                        <p><strong>Mode Of Payment:</strong> {customerInfo.modeOfPayment}</p>
                        <p><strong>Place Of Supply:</strong> {customerInfo.placeOfSupply}</p>
                        <p><strong>Place Of Delivery:</strong> {customerInfo.placeOfDelivery}</p>
                    </div>
                </div>

                <div style={{ backgroundColor: "#d1d5db", padding: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    SOLD/SERVED BY:
                    <div style={{ marginTop: "8px" }}>
                        <p><strong>{sellerInfo.companyName}</strong></p>
                        <p>{sellerInfo.address}</p>
                        {sellerInfo.additionalAddress && <p>{sellerInfo.additionalAddress}</p>}
                        <p>{sellerInfo.city}</p>
                        <p><strong>Phone Number:</strong> {sellerInfo.phone}</p>
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
                <div>
                    <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
                    <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
                </div>
                <div>
                    <p><strong>Invoice Number:</strong> {orderDetails.invoiceNumber}</p>
                    <p><strong>Invoice Date:</strong> {orderDetails.invoiceDate}</p>
                </div>
                <div>
                    <p><strong>GST Number:</strong> {orderDetails.gstNumber}</p>
                    <p><strong>PAN Number:</strong> {orderDetails.panNumber}</p>
                </div>
                <div>
                    <p><strong>CIN Number:</strong> {orderDetails.cinNumber}</p>
                </div>
            </div>

            {/* Items Table */}
            <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #d1d5db" }}>
                            {["Item", "Code", "Price", "Qty", "Total", "Disc", "Net", "Type", "GST%", "Tax", "Total"].map((header) => (
                                <th key={header} style={{
                                    border: "1px solid #d1d5db", padding: "4px",
                                    textAlign: header === "Item" || header === "Code" || header === "Qty" || header === "Type" ? "center" : "right",
                                    fontWeight: "600", fontSize: "11px"
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const itemPrice = item.price * item.quantity;
                            const taxAmount = (itemPrice * item.gstRate) / 100;
                            const netAmount = itemPrice - (discount.amount / items.length || 0);
                            return (
                                <tr key={index} style={{ borderBottom: "1px solid #d1d5db" }}>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "left" }}>
                                        {"productName" in item ? item.productName : item.serviceName}
                                    </td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>{item.code || ""}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>₹{item.price.toFixed(2)}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>₹{itemPrice.toFixed(2)}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>-</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>₹{netAmount.toFixed(2)}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>GST</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>{item.gstRate}%</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>₹{taxAmount.toFixed(2)}</td>
                                    <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right", fontWeight: "600" }}>₹{(netAmount + taxAmount).toFixed(2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #d1d5db", paddingBottom: "8px" }}>
                        <span style={{ fontWeight: "600" }}>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: "600" }}>Discount:</span><span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600" }}>Taxable Amount:</span><span>₹{taxableAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600" }}>GST (9% + 9%):</span><span>₹{totalGst.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "8px", borderTop: "2px solid #d1d5db", fontWeight: "bold", fontSize: "16px" }}>
                        <span>Total Amount:</span><span>₹{finalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Amount in Words */}
            <div style={{ marginBottom: "24px", fontSize: "14px" }}>
                <p><strong>Amount in words:</strong> {/* TODO: replace with actual amountToWords */} {finalAmount}</p>
            </div>

            {/* Signature */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ height: "48px", width: "96px", borderTop: "1px solid #9ca3af", marginBottom: "16px" }}></div>
                    <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>Authorized Signatory</p>
                </div>
            </div>

            {/* Notes */}
            {notes && (
                <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#f9fafb", fontSize: "14px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "8px", margin: "0 0 8px 0" }}>Additional Notes:</p>
                    <p style={{ margin: 0 }}>{notes}</p>
                </div>
            )}

            {/* Terms and Conditions */}
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #d1d5db", fontSize: "12px" }}>
                <p style={{ fontWeight: "600", marginBottom: "8px", margin: "0 0 8px 0" }}>Terms and Conditions:</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: "4px", margin: 0, paddingLeft: "20px" }}>
                    <li>1. We encourage you to raise any concerns on the customer care number or email ID mentioned above.</li>
                    <li>2. Any issue arising from a service delivered by us should be reported within 48 hours of completion.</li>
                    <li>3. If you wish to return a product, it will be accepted within seven days of the date of purchase.</li>
                </ul>
            </div>
        </div>
    );
}
