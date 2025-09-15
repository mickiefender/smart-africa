import { WhatsAppService, type WhatsAppMessage } from "../lib/whatsapp"

interface UseWhatsAppReturn {
  sendOrderToWhatsApp: (orderData: {
    customerName: string
    email: string
    phone: string
    company?: string
    cardType: string
    quantity: string
    message?: string
  }) => void

  sendReceiptToWhatsApp: (receiptData: {
    customerName: string
    email: string
    phone: string
    company?: string
    reference: string
    cardType: string
    quantity: string
    amount: number
    planName: string
  }) => void

  sendSupportRequest: (supportData: {
    customerName: string
    email: string
    phone: string
    company?: string
    message: string
  }) => void

  sendGeneralInquiry: (inquiryData: {
    customerName: string
    email: string
    phone: string
    company?: string
    message: string
  }) => void
}

export function useWhatsApp(): UseWhatsAppReturn {
  const sendOrderToWhatsApp = (orderData: {
    customerName: string
    email: string
    phone: string
    company?: string
    cardType: string
    quantity: string
    message?: string
  }) => {
    const whatsappData: WhatsAppMessage = {
      type: "order",
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      company: orderData.company,
      message: orderData.message || "New order request from website",
      orderDetails: {
        cardType: orderData.cardType,
        quantity: orderData.quantity,
      },
    }

    WhatsAppService.sendToWhatsApp(whatsappData)
  }

  const sendReceiptToWhatsApp = (receiptData: {
    customerName: string
    email: string
    phone: string
    company?: string
    reference: string
    cardType: string
    quantity: string
    amount: number
    planName: string
  }) => {
    const whatsappData: WhatsAppMessage = {
      type: "receipt",
      customerName: receiptData.customerName,
      email: receiptData.email,
      phone: receiptData.phone,
      company: receiptData.company,
      message: "Payment confirmation and receipt",
      orderDetails: {
        reference: receiptData.reference,
        cardType: receiptData.cardType,
        quantity: receiptData.quantity,
        amount: receiptData.amount,
        planName: receiptData.planName,
      },
    }

    WhatsAppService.sendToWhatsApp(whatsappData)
  }

  const sendSupportRequest = (supportData: {
    customerName: string
    email: string
    phone: string
    company?: string
    message: string
  }) => {
    const whatsappData: WhatsAppMessage = {
      type: "support",
      customerName: supportData.customerName,
      email: supportData.email,
      phone: supportData.phone,
      company: supportData.company,
      message: supportData.message,
    }

    WhatsAppService.sendToWhatsApp(whatsappData)
  }

  const sendGeneralInquiry = (inquiryData: {
    customerName: string
    email: string
    phone: string
    company?: string
    message: string
  }) => {
    const whatsappData: WhatsAppMessage = {
      type: "inquiry",
      customerName: inquiryData.customerName,
      email: inquiryData.email,
      phone: inquiryData.phone,
      company: inquiryData.company,
      message: inquiryData.message,
    }

    WhatsAppService.sendToWhatsApp(whatsappData)
  }

  return {
    sendOrderToWhatsApp,
    sendReceiptToWhatsApp,
    sendSupportRequest,
    sendGeneralInquiry,
  }
}
