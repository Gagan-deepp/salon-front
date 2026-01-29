export default function InvoiceForServerMember({
    membershipData,
    notes,
}) {
    const { membership, customer, franchise } = membershipData;

    // Calculate totals for membership - simple amount paid
    const membershipAmount = membership.purchaseDetails.amountPaid;
    const totalAmount = membershipAmount;

    // Format dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div
            id="membership-invoice-design"
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
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>
                            {franchise.name}
                        </h1>
                        <p style={{ color: "#4b5563", margin: 0 }}>
                            {franchise.address.street}, {franchise.address.city}, {franchise.address.state} - {franchise.address.pincode}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>MEMBERSHIP INVOICE</h2>
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
                    MEMBERSHIP SOLD TO:
                    <div style={{ marginTop: "8px" }}>
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Phone Number:</strong> {customer.phone}</p>
                        <p><strong>Mode Of Payment:</strong> {membership.purchaseDetails.paymentMode}</p>
                        <p><strong>Customer ID:</strong> {membership.customerId}</p>
                    </div>
                </div>

                <div style={{ backgroundColor: "#d1d5db", padding: "8px", fontWeight: "bold", fontSize: "14px" }}>
                    SOLD BY:
                    <div style={{ marginTop: "8px" }}>
                        <p><strong>{franchise.name}</strong></p>
                        <p><strong>Franchise Code:</strong> {membership.purchaseDetails.franchiseId.code}</p>
                        <p>{franchise.address.street}</p>
                        <p>{franchise.address.city}, {franchise.address.state} - {franchise.address.pincode}</p>
                        <p><strong>GST Number:</strong> {franchise.gstNumber}</p>
                    </div>
                </div>
            </div>

            {/* Membership Details */}
            <div style={{
                backgroundColor: "#d1d5db",
                padding: "8px",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "16px"
            }}>
                MEMBERSHIP DETAILS:
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
                fontSize: "14px",
                marginBottom: "24px"
            }}>
                <div>
                    <p><strong>Membership ID:</strong> {membership._id}</p>
                    <p><strong>Offer ID:</strong> {membership.offerId}</p>
                    <p><strong>Purchase Date:</strong> {formatDate(membership.createdAt)}</p>
                    <p><strong>Status:</strong> {membership.status}</p>
                </div>
                <div>
                    <p><strong>Invoice Number:</strong> MEM-{membership._id.slice(-8)}</p>
                    <p><strong>Invoice Date:</strong> {formatDate(membership.createdAt)}</p>
                    <p><strong>Valid From:</strong> {formatDate(membership.validity.startDate)}</p>
                    <p><strong>Valid Until:</strong> {formatDate(membership.validity.endDate)}</p>
                </div>
            </div>

            {/* Membership Benefits Table */}
            <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #d1d5db" }}>
                            {["Description", "Value", "Benefits", "Usage Details", "Amount"].map((header) => (
                                <th key={header} style={{
                                    border: "1px solid #d1d5db", padding: "8px",
                                    textAlign: "center",
                                    fontWeight: "600", fontSize: "11px"
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: "1px solid #d1d5db" }}>
                            <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "left" }}>
                                Membership Package
                            </td>
                            <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>
                                ₹{membership.benefits.membershipValue.toFixed(2)}
                            </td>
                            <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>
                                {membership.benefits.discountPercentage}% Discount<br />
                                {membership.benefits.bonusPercentage}% Bonus
                            </td>
                            <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>
                                {membership.usage.remainingUsages}/{membership.usage.maxUsages} Remaining
                            </td>
                            <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right", fontWeight: "600" }}>
                                ₹{membershipAmount.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "8px", borderTop: "2px solid #d1d5db", fontWeight: "bold", fontSize: "16px" }}>
                        <span>Total Amount Paid:</span><span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Amount in Words */}
            <div style={{ marginBottom: "24px", fontSize: "14px" }}>
                <p><strong>Amount in words:</strong> {/* TODO: replace with actual amountToWords */} {totalAmount}</p>
            </div>

            {/* Membership Benefits Section */}
            <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#f9fafb", fontSize: "14px" }}>
                <p style={{ fontWeight: "600", marginBottom: "8px", margin: "0 0 8px 0" }}>Membership Benefits:</p>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    <li>{membership.benefits.discountPercentage}% discount on all services</li>
                    <li>{membership.benefits.bonusPercentage}% bonus credits on membership value</li>
                    <li>Valid for {membership.usage.maxUsages} service usages</li>
                    <li>Membership valid until {formatDate(membership.validity.endDate)}</li>
                </ul>
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
                    <li>1. Membership is non-transferable and valid only for the registered member.</li>
                    <li>2. Membership benefits are applicable only during the validity period.</li>
                    <li>3. Any unused services will expire at the end of membership validity period.</li>
                    <li>4. Membership can be renewed before expiry to continue enjoying benefits.</li>
                    <li>5. Refund policy applicable as per company terms and conditions.</li>
                </ul>
            </div>
        </div>
    );
}
