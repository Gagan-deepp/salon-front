"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react"
import * as XLSX from "xlsx"
import { bulkcreatePayment, GetbulkPaymentTemplate } from "@/lib/actions/bulk_action"
import { Badge } from "../ui/badge"

const VALID_PAYMENT_MODES = ["CASH", "UPI", "CARD"]

const parseDate = (value) => {
    if (!value) return ""
    const str = String(value).trim()

    const ddmm = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ddmm) {
        const [, d, m, y] = ddmm
        const date = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (iso) {
        const date = new Date(str)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    if (/^\d{5}$/.test(str)) {
        const excelEpoch = new Date(1899, 11, 30)
        const date = new Date(excelEpoch.getTime() + parseInt(str) * 86400000)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    return str
}

const BulkPaymentUpload = () => {
    const [file, setFile] = useState(null)
    const [valid, setValid] = useState(null)
    const [parsedData, setParsedData] = useState([])
    const [isParsing, setIsParsing] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [uploadErrors, setUploadErrors] = useState([])
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownloadTemplate = async () => {
        setIsDownloading(true)
        try {
            const res = await GetbulkPaymentTemplate()
            if (res.success) {
                const byteCharacters = atob(res.data)
                const byteNumbers = new Array(byteCharacters.length)
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                const byteArray = new Uint8Array(byteNumbers)
                const blob = new Blob([byteArray], { type: res.contentType })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = res.filename
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                toast.success("Template downloaded")
            } else {
                toast.error(res.error || "Failed to download template")
            }
        } catch (error) {
            toast.error("Failed to download template")
        } finally {
            setIsDownloading(false)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (selectedFile) => {
        const validTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv"
        ]

        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Please upload a valid Excel or CSV file")
            return
        }

        setFile(selectedFile)
        setParsedData([])
        toast.success(`File "${selectedFile.name}" selected`)
    }

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const validateRow = (row) => {
        const errors = []

        const phoneDigits = String(row.customerPhone).replace(/\D/g, "")
        if (!phoneDigits || phoneDigits.length !== 10) {
            errors.push("CustomerPhone must be exactly 10 digits")
        }

        if (!row.serviceName) {
            errors.push("ServiceName is required")
        }

        if (row.paymentMode && !VALID_PAYMENT_MODES.includes(row.paymentMode.toUpperCase())) {
            errors.push("PaymentMode must be CASH, UPI, or CARD")
        }

        return {
            ...row,
            valid: errors.length === 0 ? "valid" : "invalid",
            error: errors.join(", ")
        }
    }

    const parseExcel = async () => {
        if (!file) {
            toast.error("Please select a file first")
            return
        }

        setIsParsing(true)

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            const parsed = jsonData.map((row) => {
                const customerPhone = String(row.CustomerPhone || row.customerPhone || row.customerphone || "").trim()
                const serviceName = row.ServiceName || row.serviceName || row.servicename || ""
                const serviceQuantity = row.ServiceQuantity || row.serviceQuantity || row.servicequantity || ""
                const cashierEmail = row.CashierEmail || row.cashierEmail || row.cashieremail || ""
                const providerEmail = row.ProviderEmail || row.providerEmail || row.provideremail || ""
                const paymentMode = row.PaymentMode || row.paymentMode || row.paymentmode || ""
                const paymentDate = parseDate(row.PaymentDate || row.paymentDate || row.paymentdate || "")
                const subtotal = row.Subtotal || row.subtotal || ""
                const discountPercentage = row.DiscountPercentage || row.discountPercentage || row.discountpercentage || ""
                const discountAmount = row.DiscountAmount || row.discountAmount || row.discountamount || ""
                const cgst = row.CGST || row.cgst || ""
                const sgst = row.SGST || row.sgst || ""
                const igst = row.IGST || row.igst || ""
                const gstTotal = row.GSTTotal || row.gstTotal || row.gsttotal || ""
                const finalAmount = row.FinalAmount || row.finalAmount || row.finalamount || ""
                const promoCode = row.PromoCode || row.promoCode || row.promocode || ""
                const transactionId = row.TransactionId || row.transactionId || row.transactionid || ""
                const cardLast4Digits = row.CardLast4Digits || row.cardLast4Digits || row.cardlast4digits || ""
                const cardType = row.CardType || row.cardType || row.cardtype || ""
                const upiVPA = row.UpiVPA || row.upiVPA || row.upivpa || ""
                const upiTransactionRef = row.UpiTransactionRef || row.upiTransactionRef || row.upitransactionref || ""
                const notes = row.Notes || row.notes || ""

                return {
                    customerPhone,
                    serviceName,
                    serviceQuantity,
                    cashierEmail,
                    providerEmail,
                    paymentMode,
                    paymentDate,
                    subtotal,
                    discountPercentage,
                    discountAmount,
                    cgst,
                    sgst,
                    igst,
                    gstTotal,
                    finalAmount,
                    promoCode,
                    transactionId,
                    cardLast4Digits,
                    cardType,
                    upiVPA,
                    upiTransactionRef,
                    notes,
                }
            })

            const validatedData = parsed.map(validateRow)
            setParsedData(validatedData)

            const validCount = validatedData.filter(v => v.valid === "valid").length
            setValid(validCount)
            toast.success(`Parsed ${validatedData.length} payments (${validCount} valid)`)
        } catch (error) {
            console.error("Parse error:", error)
            toast.error("Failed to parse Excel file")
        } finally {
            setIsParsing(false)
        }
    }

    const handleBulkUpload = async () => {
        setUploadErrors([])
        try {
            startTransition(async () => {
                const formData = new FormData()
                formData.append("file", file)
                const res = await bulkcreatePayment(formData)
                if (res.success) {
                    toast.success(`Successfully uploaded payments`)
                } else {
                    toast.warning(res.error)
                    if (res.errors?.length > 0) {
                        setUploadErrors(res.errors)
                    }
                }
            })
        } catch (error) {
            console.error("Bulk upload error:", error)
            toast.error("An error occurred during bulk upload")
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Bulk Payment Upload</CardTitle>
                            <CardDescription>
                                Upload an Excel file with columns: CustomerPhone, ServiceName, ServiceQuantity, CashierEmail, ProviderEmail, PaymentMode, PaymentDate, Subtotal, DiscountPercentage, DiscountAmount, CGST, SGST, IGST, GSTTotal, FinalAmount, PromoCode, TransactionId, CardLast4Digits, CardType, UpiVPA, UpiTransactionRef, Notes
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )}
                            Download Template
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Validation rules */}
                    <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                        <p className="font-medium mb-2">Validation Rules:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>CustomerPhone must be exactly 10 digits</li>
                            <li>ServiceName is required</li>
                            <li>PaymentMode must be one of: CASH, UPI, CARD</li>
                            <li>PaymentDate format: DD/MM/YYYY</li>
                        </ul>
                    </div>

                    <div
                        className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileInput}
                        />
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="p-4 bg-primary/10 rounded-full">
                                {file ? (
                                    <FileSpreadsheet className="w-10 h-10 text-primary" />
                                ) : (
                                    <Upload className="w-10 h-10 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-semibold">
                                    {file ? file.name : "Drop your Excel file here"}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    or click to browse (Excel or CSV)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={parseExcel}
                            disabled={!file || isParsing}
                            className="flex-1 py-6"
                        >
                            {isParsing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Parsing...
                                </>
                            ) : (
                                "Parse File"
                            )}
                        </Button>
                        {parsedData.length > 0 && (
                            <Button
                                onClick={handleBulkUpload}
                                disabled={parsedData.filter(v => v.valid === "valid").length === 0 || isPending}
                                className="flex-1 py-6 "
                                variant="secondary"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    `Upload ${parsedData.filter(v => v.valid === "valid").length} Payments`
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {uploadErrors.length > 0 && (
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Upload Errors ({uploadErrors.length})
                        </CardTitle>
                        <CardDescription>
                            The following rows failed during upload
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-destructive/20 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20">Row</TableHead>
                                        <TableHead>Error</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {uploadErrors.map((err, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono font-medium">{err.row}</TableCell>
                                            <TableCell className="text-destructive text-sm">{err.error}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {parsedData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Parsed Payments ({parsedData.length})
                            <span className="text-green-300" >  {valid !== null && `${valid} valid`} </span>
                            <span className="text-red-300" >  {valid !== null && `${parsedData.length - valid} Invalid`} </span>
                        </CardTitle>
                        <CardDescription>
                            Review the parsed data before uploading
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Valid</TableHead>
                                        <TableHead>Customer Phone</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Cashier Email</TableHead>
                                        <TableHead>Provider Email</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Disc %</TableHead>
                                        <TableHead>Disc Amt</TableHead>
                                        <TableHead>CGST</TableHead>
                                        <TableHead>SGST</TableHead>
                                        <TableHead>IGST</TableHead>
                                        <TableHead>GST Total</TableHead>
                                        <TableHead>Final Amt</TableHead>
                                        <TableHead>Promo</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Card Last 4</TableHead>
                                        <TableHead>Card Type</TableHead>
                                        <TableHead>UPI VPA</TableHead>
                                        <TableHead>UPI Ref</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Error Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((payment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {payment.valid === "valid" ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono">{payment.customerPhone}</TableCell>
                                            <TableCell className="font-medium">{payment.serviceName}</TableCell>
                                            <TableCell>{payment.serviceQuantity || "—"}</TableCell>
                                            <TableCell className="text-xs max-w-[120px] truncate">{payment.cashierEmail || "—"}</TableCell>
                                            <TableCell className="text-xs max-w-[120px] truncate">{payment.providerEmail || "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant={VALID_PAYMENT_MODES.includes(payment.paymentMode?.toUpperCase()) ? "gradient" : "secondary"}>
                                                    {payment.paymentMode || "—"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{payment.paymentDate || "—"}</TableCell>
                                            <TableCell>{payment.subtotal || "—"}</TableCell>
                                            <TableCell>{payment.discountPercentage || "—"}</TableCell>
                                            <TableCell>{payment.discountAmount || "—"}</TableCell>
                                            <TableCell>{payment.cgst || "—"}</TableCell>
                                            <TableCell>{payment.sgst || "—"}</TableCell>
                                            <TableCell>{payment.igst || "—"}</TableCell>
                                            <TableCell>{payment.gstTotal || "—"}</TableCell>
                                            <TableCell className="font-medium">{payment.finalAmount || "—"}</TableCell>
                                            <TableCell className="text-xs">{payment.promoCode || "—"}</TableCell>
                                            <TableCell className="font-mono text-xs">{payment.transactionId || "—"}</TableCell>
                                            <TableCell>{payment.cardLast4Digits || "—"}</TableCell>
                                            <TableCell>{payment.cardType || "—"}</TableCell>
                                            <TableCell className="text-xs">{payment.upiVPA || "—"}</TableCell>
                                            <TableCell className="font-mono text-xs">{payment.upiTransactionRef || "—"}</TableCell>
                                            <TableCell className="max-w-[150px] truncate text-muted-foreground">{payment.notes || "—"}</TableCell>
                                            <TableCell className="text-xs text-destructive max-w-[200px] truncate">
                                                {payment.error}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default BulkPaymentUpload