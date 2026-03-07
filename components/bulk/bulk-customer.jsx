"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { bulkcreateCustomer } from "@/lib/actions/bulk_action"
import { Badge } from "../ui/badge"

const VALID_GENDERS = ["MALE", "FEMALE", "OTHER"]

const parseDate = (value) => {
    if (!value) return ""
    const str = String(value).trim()

    // Try DD/MM/YYYY
    const ddmm = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ddmm) {
        const [, d, m, y] = ddmm
        const date = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    // Try YYYY-MM-DD (ISO)
    const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (iso) {
        const date = new Date(str)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    // Try Excel serial number
    if (/^\d{5}$/.test(str)) {
        const excelEpoch = new Date(1899, 11, 30)
        const date = new Date(excelEpoch.getTime() + parseInt(str) * 86400000)
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0]
    }

    return str
}

const parseIsMember = (value) => {
    if (value === undefined || value === null || value === "") return false
    const str = String(value).trim().toLowerCase()
    return ["yes", "true", "1"].includes(str)
}

const BulkCustomerUpload = () => {
    const [file, setFile] = useState(null)
    const [valid, setValid] = useState(null)
    const [parsedData, setParsedData] = useState([])
    const [isParsing, setIsParsing] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [uploadErrors, setUploadErrors] = useState([])

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

        if (!row.name) {
            errors.push("Name is required")
        }

        const phoneDigits = String(row.phone).replace(/\D/g, "")
        if (!phoneDigits || phoneDigits.length !== 10) {
            errors.push("Phone must be exactly 10 digits")
        }

        if (!row.gender || !VALID_GENDERS.includes(row.gender.toUpperCase())) {
            errors.push("Gender must be one of: MALE, FEMALE, OTHER")
        }

        if (row.dateOfBirth) {
            const parsed = parseDate(row.dateOfBirth)
            const date = new Date(parsed)
            if (isNaN(date.getTime())) {
                errors.push("Date format: DD/MM/YYYY or MM/DD/YYYY")
            }
        }

        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push("Invalid email format")
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
                const name = row.name || row.Name || row.FullName || row.fullName || ""
                const phone = String(row.phone || row.Phone || row.PhoneNumber || row.phoneNumber || "").trim()
                const email = row.email || row.Email || ""
                const genderRaw = row.gender || row.Gender || ""
                const gender = String(genderRaw).trim().toUpperCase()
                const dateOfBirth = parseDate(row.dateOfBirth || row.DateOfBirth || row.DOB || row.dob || "")
                const isMember = parseIsMember(row.isMember || row.IsMember || row.is_member || "")
                const street = row.street || row.Street || row.address || row.Address || ""
                const city = row.city || row.City || ""
                const state = row.state || row.State || ""
                const pincode = row.pincode || row.Pincode || row.zip || row.Zip || ""
                const notes = row.notes || row.Notes || ""

                const backendPayload = {
                    name,
                    phone: phone.replace(/\D/g, ""),
                    email: email || undefined,
                    gender: VALID_GENDERS.includes(gender) ? gender : undefined,
                    dateOfBirth: dateOfBirth || undefined,
                    isMember,
                    address: (street || city || state || pincode) ? {
                        street: street || undefined,
                        city: city || undefined,
                        state: state || undefined,
                        pincode: pincode || undefined,
                    } : undefined,
                    preferences: notes ? { notes } : undefined,
                }

                return {
                    name,
                    phone,
                    email,
                    gender,
                    dateOfBirth,
                    isMember,
                    street,
                    city,
                    state,
                    pincode,
                    notes,
                    backendPayload,
                }
            })

            const validatedData = parsed.map(validateRow)
            setParsedData(validatedData)

            const validCount = validatedData.filter(v => v.valid === "valid").length
            setValid(validCount)
            toast.success(`Parsed ${validatedData.length} customers (${validCount} valid)`)
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
                const res = await bulkcreateCustomer(formData)
                if (res.success) {
                    toast.success(`Successfully uploaded customers`)
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
                    <CardTitle>Bulk Customer Upload</CardTitle>
                    <CardDescription>
                        Upload an Excel file with columns: Name, Phone, Email, Gender, DateOfBirth, IsMember, Street, City, State, Pincode, Notes
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Validation rules */}
                    <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                        <p className="font-medium mb-2">Validation Rules:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Phone numbers must be exactly 10 digits</li>
                            <li>Gender must be one of: MALE, FEMALE, OTHER</li>
                            <li>Date format: DD/MM/YYYY or MM/DD/YYYY</li>
                            <li>IsMember: Yes/No, True/False, or 1/0</li>
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
                                    `Upload ${parsedData.filter(v => v.valid === "valid").length} Customers`
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
                        <CardTitle>Parsed Customers ({parsedData.length})
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead>Is Member</TableHead>
                                        <TableHead>Street</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Pincode</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Error Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((customer, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {customer.valid === "valid" ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {customer.name}
                                            </TableCell>
                                            <TableCell>{customer.phone}</TableCell>
                                            <TableCell className="max-w-[150px] truncate text-xs">
                                                {customer.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={VALID_GENDERS.includes(customer.gender) ? "gradient" : "secondary"}>
                                                    {customer.gender || "—"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{customer.dateOfBirth || "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant={customer.isMember ? "gradient" : "outline"}>
                                                    {customer.isMember ? "Yes" : "No"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[150px] truncate text-muted-foreground">
                                                {customer.street}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{customer.city}</TableCell>
                                            <TableCell className="text-muted-foreground">{customer.state}</TableCell>
                                            <TableCell className="text-muted-foreground">{customer.pincode}</TableCell>
                                            <TableCell className="max-w-[150px] truncate text-muted-foreground">
                                                {customer.notes}
                                            </TableCell>
                                            <TableCell className="text-xs text-destructive max-w-[200px] truncate">
                                                {customer.error}
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

export default BulkCustomerUpload