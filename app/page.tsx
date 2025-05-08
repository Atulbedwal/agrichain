"use client"

import type React from "react"

import { useState } from "react"
import { calculateTotal, pricingRules } from "@/lib/checkout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CheckoutPage() {
  const [items, setItems] = useState("")
  const [total, setTotal] = useState(0)
  const [history, setHistory] = useState<{ input: string; output: number }[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const calculatedTotal = calculateTotal(items)
    setTotal(calculatedTotal)
    setHistory([...history, { input: items, output: calculatedTotal }])
  }

  const handleClear = () => {
    setItems("")
    setTotal(0)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const exampleInputs = [
    "",
    "A",
    "AB",
    "CDBA",
    "AA",
    "AAA",
    "AAAA",
    "AAAAA",
    "AAAAAA",
    "AAAB",
    "AAABB",
    "AAABBD",
    "DABABA",
  ]

  const handleExampleClick = (example: string) => {
    setItems(example)
    const calculatedTotal = calculateTotal(example)
    setTotal(calculatedTotal)
    setHistory([...history, { input: example, output: calculatedTotal }])
  }

  const generateReceipt = () => {
    if (!items) return


    const itemCounts: Record<string, number> = {}
    for (const item of items) {
      itemCounts[item] = (itemCounts[item] || 0) + 1
    }


    const date = new Date().toLocaleString()
    let receiptContent = "SUPERMARKET RECEIPT\n"
    receiptContent += "===================\n\n"
    receiptContent += `Date: ${date}\n\n`
    receiptContent += "Items:\n"

    let subtotal = 0


    for (const [item, count] of Object.entries(itemCounts)) {
      const rule = pricingRules[item]
      let itemTotal = 0

      if (rule.specialQuantity && rule.specialPrice) {
        const specialDeals = Math.floor(count / rule.specialQuantity)
        const remainingItems = count % rule.specialQuantity

        if (specialDeals > 0) {
          receiptContent += `${item} x ${rule.specialQuantity} (Special): ${rule.specialPrice} x ${specialDeals}\n`
          itemTotal += specialDeals * rule.specialPrice
        }

        if (remainingItems > 0) {
          receiptContent += `${item} x ${remainingItems}: ${rule.unitPrice * remainingItems}\n`
          itemTotal += remainingItems * rule.unitPrice
        }
      } else {
        receiptContent += `${item} x ${count}: ${rule.unitPrice * count}\n`
        itemTotal = count * rule.unitPrice
      }

      subtotal += itemTotal
    }

    receiptContent += "\n===================\n"
    receiptContent += `TOTAL: ${total}\n`
    receiptContent += "===================\n\n"
    receiptContent += "Thank you for shopping with us!"


    const element = document.createElement("a")
    const file = new Blob([receiptContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Supermarket Checkout Kata</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Checkout Calculator</CardTitle>
            <CardDescription>Enter items as letters (A, B, C, D) in any order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="items" className="text-sm font-medium">
                  Items
                </label>
                <Input
                  id="items"
                  value={items}
                  onChange={(e) => setItems(e.target.value.toUpperCase())}
                  placeholder="Enter items (e.g., AABCD)"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button type="submit" variant="default">
                  Calculate Total
                </Button>
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Total Price:</p>
              <p className="text-3xl font-bold">{total}</p>
              {items && (
                <Button variant="outline" size="sm" className="mt-2" onClick={generateReceipt}>
                  Download Receipt
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="text-sm font-medium mb-2">Try examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleInputs.map((example) => (
                <Button key={example} variant="outline" size="sm" onClick={() => handleExampleClick(example)}>
                  {example || '""'}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Rules</CardTitle>
            <CardDescription>Current pricing and special offers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Special Offer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>A</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>3 for 130</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>B</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>2 for 45</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>C</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>D</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {history.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Calculation History</CardTitle>
          </CardHeader>
          <div className="px-6 pb-2">
            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Input</TableHead>
                  <TableHead>Output</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.input || '""'}</TableCell>
                    <TableCell>{item.output}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
