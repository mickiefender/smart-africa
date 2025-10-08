// Receipt generation utilities
export interface ReceiptData {
  reference: string
  customerName: string
  email: string
  phone: string
  company?: string
  cardType: string
  quantity: string
  planName: string
  amount: number
  paidAt: string
  transactionId: string
}

export class ReceiptGenerator {
  static generateReceiptHTML(data: ReceiptData): string {
    const currentDate = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Smart Africa - Payment Receipt</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .header p {
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            padding: 30px;
          }
          .receipt-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
          }
          .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .info-label {
            font-weight: 600;
            color: #495057;
          }
          .info-value {
            color: #212529;
            text-align: right;
          }
          .total-section {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #0066cc;
          }
          .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            text-align: center;
          }
          .success-badge {
            background: #d4edda;
            color: #155724;
            padding: 12px 20px;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 25px;
            border: 1px solid #c3e6cb;
          }
          .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .contact-info {
            color: #495057;
            font-size: 14px;
          }
          .reference-number {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
          }
          @media print {
            body { background: white; padding: 0; }
            .receipt-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>Smart Africa</h1>
            <p>Digital Business Cards & Solutions</p>
          </div>
          
          <div class="content">
            <div class="success-badge">
              ✅ Payment Successful
            </div>
            
            <div class="receipt-info">
              <div class="info-row">
                <span class="info-label">Receipt Number:</span>
                <span class="info-value reference-number">${data.reference}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value">${data.transactionId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${currentDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Customer:</span>
                <span class="info-value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${data.phone}</span>
              </div>
              ${
                data.company
                  ? `
              <div class="info-row">
                <span class="info-label">Company:</span>
                <span class="info-value">${data.company}</span>
              </div>
              `
                  : ""
              }
            </div>

            <div class="receipt-info">
              <div class="info-row">
                <span class="info-label">Plan:</span>
                <span class="info-value">${data.planName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Card Type:</span>
                <span class="info-value">${data.cardType}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Quantity:</span>
                <span class="info-value">${data.quantity}</span>
              </div>
            </div>

            <div class="total-section">
              <div class="total-amount">
                Total Paid: ¢${data.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Thank you for choosing Smart Africa!</strong></p>
            <p>Your digital business cards will be processed within 24-48 hours.</p>
            <div class="contact-info">
              <p>📧 orders@smartafrica.com | 📞 +233 208 517 482</p>
              <p>🏢 Takoradi, Ghana| 🌐 www.smartafrica.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  static async generatePDF(receiptData: ReceiptData): Promise<Blob> {
    // For client-side PDF generation, we'll use html2pdf or similar
    // This is a placeholder for the actual PDF generation logic
    const html = this.generateReceiptHTML(receiptData)

    // In a real implementation, you would use a library like:
    // - html2pdf.js for client-side generation
    // - Puppeteer for server-side generation
    // - jsPDF for programmatic PDF creation

    return new Blob([html], { type: "text/html" })
  }

  static downloadReceipt(receiptData: ReceiptData) {
    const html = this.generateReceiptHTML(receiptData)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `Smart_Africa_Receipt_${receiptData.reference}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static printReceipt(receiptData: ReceiptData) {
    const html = this.generateReceiptHTML(receiptData)
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }
}
