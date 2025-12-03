export const runtime = 'nodejs'

import { sendMail } from "@/lib/actions/mail";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from 'fs/promises';
import { NextResponse } from "next/server";
import os from "os";
import path from "path";

export async function POST(request) {
    try {
        const data = await request.json();
        console.debug("\n\n Received invoice data : ", data)
        const { customerInfo, sellerInfo, orderDetails, items, companyLogo, discount, notes } = data;

        console.debug("\n\n Invoice data ===> ", data)
        if (!customerInfo || !sellerInfo || !orderDetails || !items) {
            return NextResponse.json(
                { success: false, message: "Missing required invoice data (customerInfo, sellerInfo, orderDetails, items)." },
                { status: 400 }
            );
        }

        const { renderToStaticMarkup } = await import("react-dom/server")
        const Invoice = (await import("@/components/server-invoice")).default


        const invoiceHtml = renderToStaticMarkup(
            Invoice({
                customerInfo,
                sellerInfo,
                orderDetails,
                items,
                companyLogo,
                discount,
                notes,
                mode: "server" // Make sure to pass mode="server" to hide the Download button
            })
        )


        const fullHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page { size: A4 portrait; margin: 0; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Georgia', serif; }
        #invoice-design {
          width: 210mm !important;
          min-height: 297mm !important;
          background: #fff;
        }
      </style>
    </head>
    <body>
      ${invoiceHtml}
    </body>
  </html>
`


        console.debug("\n Launching browser using puppeteer...")

        let puppeteer;
        let browser;

        if (process.platform === 'darwin') {
            // macOS local dev - use regular puppeteer with its bundled Chrome
            console.debug("Running on macOS - using bundled Puppeteer")
            puppeteer = (await import('puppeteer')).default;

            browser = await puppeteer.launch({
                headless: true,
                // Don't use chromium args/executablePath on Mac!
                // Puppeteer will use its own bundled Chrome
            });

        } else {
            // Linux (Cloud Run) - use puppeteer-core with sparticuz chromium
            console.debug("Running on Linux - using Sparticuz Chromium")
            const chromium = (await import('@sparticuz/chromium-min')).default;
            puppeteer = (await import('puppeteer-core')).default;


            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(
                    'https://github.com/Sparticuz/chromium/releases/download/v140.0.0/chromium-v140.0.0-pack.x64.tar'
                ),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });


        }

        console.debug("\n Browser launched successfully")

        const page = await browser.newPage();

        await page.setContent(fullHtml, { waitUntil: "networkidle0" });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tempDir = os.tmpdir();
        const tempPath = path.join(tempDir, `${customerInfo.name.replace(/ /g, "_")}_${Date.now()}.pdf`);

        await page.evaluateHandle('document.fonts.ready');
        const invoiceElement = await page.$('#invoice-design')

        if (!invoiceElement) {
            await browser.close();
            return NextResponse.json(
                { success: false, message: "Certificate element not found." },
                { status: 500 }
            );
        }

        await page.emulateMediaType('screen');

        await page.pdf({
            path: tempPath,
            format: 'A4',
            landscape: false,
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            displayHeaderFooter: false,
            pageRanges: '1',
        })


        console.log("Saved invoice pdf at:", tempPath);
        await browser.close();
        console.debug("\n Browser closed")

        // Upload to S3
        const fileBuffer = await fs.readFile(tempPath);
        const bucketName = process.env.AWS_S3_BUCKET;
        const timestamp = Date.now();
        const destination = `invoices/${timestamp}-${customerInfo.name.replace(/ /g, "_")}.pdf`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: destination,
            Body: fileBuffer,
            ContentType: 'application/pdf',
        });

        await s3Client.send(command);
        console.debug("\nUploaded invoice to S3 successfully.");

        await fs.unlink(tempPath);

        const publicUrl = `https://${bucketName}.s3.eu-north-1.amazonaws.com/${destination}`;
        console.debug("\n Public URL ==> ", publicUrl)

        try {
            await sendMail({
                data: {
                    customerInfo,
                    sellerInfo,
                    orderDetails,
                    invoiceLink: publicUrl
                }
            });
            console.debug("\n Sent invoice email successfully.")
        } catch (error) {
            console.error("Error sending invoice email:", error);
            return NextResponse.json(
                { success: false, message: "An internal server error occurred while sending the invoice email." },
                { status: 500 }
            );
        }
        return NextResponse.json({
            success: true,
            publicUrl,
        });

    } catch (error) {
        console.error("Error in /api/generate-Invoice:", error);
        return NextResponse.json(
            { success: false, message: "An internal server error occurred while generating the certificate." },
            { status: 500 }
        );
    }
}
