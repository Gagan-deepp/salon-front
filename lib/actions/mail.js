"use server"
import nodemailer from "nodemailer"


export const sendMail = async ({ data }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const htmlBody = await invoiceEmailTemplate({
      customerInfo: data.customerInfo,
      sellerInfo: data.sellerInfo,
      orderDetails: data.orderDetails,
      invoiceLink: data.invoiceLink
    });

    const mailConfig = {
      from: process.env.EMAIL_USER,
      to: data.customerInfo.email,
      subject: `Invoice from ${data.sellerInfo.companyName} - ${data.orderDetails.invoiceNumber}`,
      html: htmlBody
    };

    await transporter.sendMail(mailConfig);

    return { message: "Invoice mail sent successfully!", success: true }

  } catch (error) {
    console.error("Error while sending mail ==> ", error)
    return { message: "Error while sending mail!", status: "ERROR" }
  }
}

export const sendMembershipMail = async ({ data }) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { membership, customer, franchise } = data.membershipData;

    const htmlBody = await membershipEmailTemplate({
      customer,
      franchise,
      membership,
      invoiceLink: data.invoiceLink
    });

    const mailConfig = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `🎉 Membership Invoice from ${franchise.name} - MEM-${membership._id.slice(-8)}`,
      html: htmlBody
    };

    await transporter.sendMail(mailConfig);

    return { message: "Membership invoice mail sent successfully!", success: true }

  } catch (error) {
    console.error("Error while sending membership mail ==> ", error)
    return { message: "Error while sending membership mail!", status: "ERROR" }
  }
}

export const invoiceEmailTemplate = async ({
  customerInfo,
  sellerInfo,
  orderDetails,
  invoiceLink
}) => {
  const today = new Date().toLocaleDateString("en-IN");
  const primary = "#5D3FD3";
  const text = "#1b1b1b";
  const muted = "#6f6f6f";
  const border = "#e3e3e3";

  return `
 <!doctype html>
  <html>
  <body style="margin:0; padding:0; background:#f5f5f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>

          <table cellpadding="0" cellspacing="0" 
            style="max-width:600px; background:#ffffff; margin:24px auto; padding:24px; 
                   border:1px solid ${border}; border-radius:8px;">

            <tr>
              <td style="font-size:22px; font-weight:bold; color:${primary};">
                ${sellerInfo.companyName}
              </td>
            </tr>

            <tr>
              <td style="font-size:13px; color:${muted}; padding-top:4px;">
                ${today}
              </td>
            </tr>

            <tr>
              <td style="padding-top:18px; font-size:15px; color:${text}; line-height:1.6;">
                Thank you for visiting us. Below is a quick summary of your invoice.
              </td>
            </tr>

            <!-- Customer Info -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Customer Details
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Name:</strong> ${customerInfo.name}<br />
                <strong>Phone:</strong> ${customerInfo.phoneNumber}<br />
                ${customerInfo.email ? `<strong>Email:</strong> ${customerInfo.email}<br />` : ""}
                <strong>Address:</strong> ${typeof customerInfo.address === "string" ? customerInfo.address : "N/A"}
              </td>
            </tr>

            <!-- Seller Info -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Franchise Details
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Name:</strong> ${sellerInfo.companyName}<br />
                <strong>Phone:</strong> ${sellerInfo.phone}<br />
                ${sellerInfo.email ? `<strong>Email:</strong> ${sellerInfo.email}<br />` : ""}
                <strong>Address:</strong> ${sellerInfo.address}
              </td>
            </tr>

            <!-- Order Summary -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Invoice Summary
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Invoice No:</strong> ${orderDetails.invoiceNumber}<br />
                <strong>Invoice Date:</strong> ${orderDetails.invoiceDate}<br />
                <strong>Payment Mode:</strong> ${customerInfo.modeOfPayment}
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td style="padding-top:20px;">
                <a href="${invoiceLink}"
                  style="background:${primary}; color:#ffffff; padding:10px 16px; 
                         text-decoration:none; border-radius:6px; font-weight:600;">
                  View Invoice
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px; font-size:13px; color:${muted};">
                If you have any questions, feel free to contact us anytime.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export const membershipEmailTemplate = async ({
  customer,
  franchise,
  membership,
  invoiceLink
}) => {
  const today = new Date().toLocaleDateString("en-IN");
  const primary = "#5D3FD3";
  const text = "#1b1b1b";
  const muted = "#6f6f6f";
  const border = "#e3e3e3";
  const accent = "#f59e0b";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return `
 <!doctype html>
  <html>
  <body style="margin:0; padding:0; background:#f5f5f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>

          <table cellpadding="0" cellspacing="0" 
            style="max-width:600px; background:#ffffff; margin:24px auto; padding:24px; 
                   border:1px solid ${border}; border-radius:8px;">

            <tr>
              <td style="font-size:22px; font-weight:bold; color:${primary};">
                🎉 Welcome to ${franchise.name} Membership!
              </td>
            </tr>

            <tr>
              <td style="font-size:13px; color:${muted}; padding-top:4px;">
                ${today}
              </td>
            </tr>

            <tr>
              <td style="padding-top:18px; font-size:15px; color:${text}; line-height:1.6;">
                Congratulations! Your membership has been successfully activated. You can now enjoy exclusive benefits and discounts on all our services.
              </td>
            </tr>

            <!-- Membership Highlights -->
            <tr>
              <td style="padding-top:20px; background:#f8fafc; border-radius:6px; padding:16px; border-left:4px solid ${accent};">
                <div style="font-size:16px; font-weight:600; color:${accent}; margin-bottom:8px;">✨ Your Membership Benefits</div>
                <div style="font-size:14px; color:${text}; line-height:1.6;">
                  • ${membership.benefits.discountPercentage}% discount on all services<br/>
                  • ${membership.benefits.bonusPercentage}% bonus credits<br/>
                  • ₹${membership.benefits.membershipValue} worth of services<br/>
                  • Valid for ${membership.usage.maxUsages} service usages<br/>
                  • Priority booking and appointments
                </div>
              </td>
            </tr>

            <!-- Customer Info -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Member Details
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Name:</strong> ${customer.name}<br />
                <strong>Phone:</strong> ${customer.phone}<br />
                <strong>Email:</strong> ${customer.email}<br />
                <strong>Member ID:</strong> ${membership.customerId}
              </td>
            </tr>

            <!-- Franchise Info -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Franchise Details
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Name:</strong> ${franchise.name}<br />
                <strong>Address:</strong> ${franchise.address.street}, ${franchise.address.city}<br/>
                <strong>State:</strong> ${franchise.address.state} - ${franchise.address.pincode}<br/>
                <strong>GST Number:</strong> ${franchise.gstNumber}
              </td>
            </tr>

            <!-- Membership Summary -->
            <tr>
              <td style="padding-top:20px; font-size:17px; font-weight:600; color:${primary};">
                Membership Summary
              </td>
            </tr>

            <tr>
              <td style="font-size:14px; color:${text}; line-height:1.6; padding-top:6px;">
                <strong>Membership ID:</strong> ${membership._id}<br />
                <strong>Invoice No:</strong> MEM-${membership._id.slice(-8)}<br />
                <strong>Purchase Date:</strong> ${formatDate(membership.createdAt)}<br />
                <strong>Valid From:</strong> ${formatDate(membership.validity.startDate)}<br/>
                <strong>Valid Until:</strong> ${formatDate(membership.validity.endDate)}<br/>
                <strong>Amount Paid:</strong> ₹${membership.purchaseDetails.amountPaid}<br/>
                <strong>Payment Mode:</strong> ${membership.purchaseDetails.paymentMode}
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td style="padding-top:20px;">
                <a href="${invoiceLink}"
                  style="background:${primary}; color:#ffffff; padding:12px 24px; 
                         text-decoration:none; border-radius:6px; font-weight:600; display:inline-block;">
                  📄 Download Invoice
                </a>
              </td>
            </tr>

            <!-- Next Steps -->
            <tr>
              <td style="padding-top:24px; background:#f0f9ff; border-radius:6px; padding:16px; border-left:4px solid ${primary};">
                <div style="font-size:16px; font-weight:600; color:${primary}; margin-bottom:8px;">🎯 What's Next?</div>
                <div style="font-size:14px; color:${text}; line-height:1.6;">
                  1. Book your next appointment and enjoy ${membership.benefits.discountPercentage}% discount<br/>
                  2. Show this email or your membership ID during visits<br/>
                  3. Track your remaining usages: ${membership.usage.remainingUsages}/${membership.usage.maxUsages}<br/>
                  4. Membership expires on ${formatDate(membership.validity.endDate)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px; font-size:13px; color:${muted};">
                Thank you for choosing our membership program! If you have any questions about your membership benefits, feel free to contact us anytime.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}