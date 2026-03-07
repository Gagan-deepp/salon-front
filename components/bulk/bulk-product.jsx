"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react"
import * as XLSX from "xlsx"
import { bulkcreateProduct, GetbulkProductTemplate } from "@/lib/actions/bulk_action"
import { Badge } from "../ui/badge"

const parseIsActive = (value) => {
    if (value === undefined || value === null || value === "") return false
    const str = String(value).trim().toLowerCase()
    return ["yes", "true", "1"].includes(str)
}

const BulkProductUpload = () => {
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
            const res = await GetbulkProductTemplate()
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
                toast.error(res.error)
            }
        } catch (error) {
            console.error("Download template error:", error)
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

        if (!row.name) {
            errors.push("Name is required")
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
                const category = row.category || row.Category || ""
                const type = row.type || row.Type || ""
                const brand = row.brand || row.Brand || ""
                const description = row.description || row.Description || ""
                const sku = row.sku || row.SKU || row.Sku || ""
                const mrp = row.mrp || row.Mrp || row.MRP || ""
                const sellingPrice = row.sellingPrice || row.SellingPrice || ""
                const costPrice = row.costPrice || row.CostPrice || ""
                const gstRate = row.gstRate || row.GstRate || row.GSTRate || ""
                const currentStock = row.currentStock || row.CurrentStock || ""
                const minStock = row.MinimumStock || row.minimumstock || ""
                const maxStock = row.MaximumStock || row.maximumstock || ""
                const commissionRate = row.CommissionRate || row.commissionrate || ""
                const isActive = parseIsActive(row.isActive || row.IsActive || row.is_active || "")


                return {
                    name,
                    category,
                    type,
                    brand,
                    description,
                    sku,
                    mrp,
                    sellingPrice,
                    costPrice,
                    gstRate,
                    currentStock,
                    minStock,
                    maxStock,
                    commissionRate,
                    isActive,
                }
            })

            const validatedData = parsed.map(validateRow)
            setParsedData(validatedData)

            const validCount = validatedData.filter(v => v.valid === "valid").length
            setValid(validCount)
            toast.success(`Parsed ${validatedData.length} products (${validCount} valid)`)

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
                const res = await bulkcreateProduct(formData)
                if (res.success) {
                    toast.success(`Successfully uploaded products`)
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
                            <CardTitle>Bulk Product Upload</CardTitle>
                            <CardDescription>
                                Upload an Excel file with columns: Name, Category, Type, Brand, Description, SKU, MRP, SellingPrice, CostPrice, GstRate, CurrentStock, MinStock, MaxStock, CommissionRate, IsActive
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
                            <li>Name is required</li>
                            <li>IsActive: Yes/No, True/False, or 1/0</li>
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
                                    `Upload ${parsedData.filter(v => v.valid === "valid").length} Products`
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
                        <CardTitle>Parsed Products ({parsedData.length})
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
                                        <TableHead>Category</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>MRP</TableHead>
                                        <TableHead>Selling Price</TableHead>
                                        <TableHead>Cost Price</TableHead>
                                        <TableHead>GST Rate</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Min Stock</TableHead>
                                        <TableHead>Max Stock</TableHead>
                                        <TableHead>Commission Rate</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead>Error Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {product.valid === "valid" ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>{product.category || "—"}</TableCell>
                                            <TableCell>{product.type || "—"}</TableCell>
                                            <TableCell>{product.brand || "—"}</TableCell>
                                            <TableCell className="max-w-[150px] truncate text-xs">
                                                {product.description || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{product.sku || "—"}</TableCell>
                                            <TableCell>{product.mrp || "—"}</TableCell>
                                            <TableCell>{product.sellingPrice || "—"}</TableCell>
                                            <TableCell>{product.costPrice || "—"}</TableCell>
                                            <TableCell>{product.gstRate || "—"}</TableCell>
                                            <TableCell>{product.currentStock || "—"}</TableCell>
                                            <TableCell>{product.minStock || "—"}</TableCell>
                                            <TableCell>{product.maxStock || "—"}</TableCell>
                                            <TableCell>{product.commissionRate || "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.isActive ? "gradient" : "outline"}>
                                                    {product.isActive ? "Yes" : "No"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-destructive max-w-[200px] truncate">
                                                {product.error}
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

export default BulkProductUpload