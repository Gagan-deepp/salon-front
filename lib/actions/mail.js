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