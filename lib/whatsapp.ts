// WhatsApp integration utilities
export interface WhatsAppMessage {
  type: "order" | "support" | "receipt" | "inquiry"
  customerName: string
  email: string
  phone: string
  company?: string
  message: string
  orderDetails?: {
    reference?: string
    cardType?: string
    quantity?: string
    amount?: number
    planName?: string
  }
}

export class WhatsAppService {
  private static readonly BUSINESS_NUMBER = "233208517482" // Smart Africa WhatsApp Business number

  static generateOrderMessage(data: WhatsAppMessage): string {
    const { customerName, email, phone, company, orderDetails } = data

    let message = `🌟 *New Order - Smart Africa Digital Cards*\n\n`
    message += `👤 *Customer Information:*\n`
    message += `• Name: ${customerName}\n`
    message += `• Email: ${email}\n`
    message += `• Phone: ${phone}\n`
    if (company) message += `• Company: ${company}\n`

    if (orderDetails) {
      message += `\n📋 *Order Details:*\n`
      if (orderDetails.reference) message += `• Reference: ${orderDetails.reference}\n`
      if (orderDetails.planName) message += `• Plan: ${orderDetails.planName}\n`
      if (orderDetails.cardType) message += `• Card Type: ${orderDetails.cardType}\n`
      if (orderDetails.quantity) message += `• Quantity: ${orderDetails.quantity}\n`
      if (orderDetails.amount) message += `• Amount: ₦${orderDetails.amount.toLocaleString()}\n`
    }

    message += `\n💬 *Customer Message:*\n${data.message}\n`
    message += `\n⏰ *Sent:* ${new Date().toLocaleString("en-NG")}\n`
    message += `\n_Please respond to this customer as soon as possible._`

    return message
  }

  static generateReceiptMessage(data: WhatsAppMessage): string {
    const { customerName, email, phone, company, orderDetails } = data

    let message = `✅ *Payment Confirmation - Smart Africa*\n\n`
    message += `Hello Smart Africa Team!\n\n`
    message += `I've just completed my payment for digital business cards. Here are my order details:\n\n`

    message += `📋 *Order Details:*\n`
    if (orderDetails?.reference) message += `• Reference: ${orderDetails.reference}\n`
    if (orderDetails?.planName) message += `• Plan: ${orderDetails.planName}\n`
    if (orderDetails?.cardType) message += `• Card Type: ${orderDetails.cardType}\n`
    if (orderDetails?.quantity) message += `• Quantity: ${orderDetails.quantity}\n`
    if (orderDetails?.amount) message += `• Amount Paid: ₦${orderDetails.amount.toLocaleString()}\n`

    message += `\n👤 *Customer Information:*\n`
    message += `• Name: ${customerName}\n`
    message += `• Email: ${email}\n`
    message += `• Phone: ${phone}\n`
    if (company) message += `• Company: ${company}\n`

    message += `\nPlease confirm receipt of this payment and let me know the next steps for my digital business cards.\n\n`
    message += `Thank you! 🙏`

    return message
  }

  static generateSupportMessage(data: WhatsAppMessage): string {
    const { customerName, email, phone, company } = data

    let message = `🆘 *Support Request - Smart Africa*\n\n`
    message += `👤 *Customer Information:*\n`
    message += `• Name: ${customerName}\n`
    message += `• Email: ${email}\n`
    message += `• Phone: ${phone}\n`
    if (company) message += `• Company: ${company}\n`

    message += `\n💬 *Support Request:*\n${data.message}\n`
    message += `\n⏰ *Sent:* ${new Date().toLocaleString("en-NG")}\n`
    message += `\n_Customer needs assistance. Please respond promptly._`

    return message
  }

  static generateInquiryMessage(data: WhatsAppMessage): string {
    const { customerName, email, phone, company } = data

    let message = `💡 *General Inquiry - Smart Africa*\n\n`
    message += `👤 *Customer Information:*\n`
    message += `• Name: ${customerName}\n`
    message += `• Email: ${email}\n`
    message += `• Phone: ${phone}\n`
    if (company) message += `• Company: ${company}\n`

    message += `\n💬 *Inquiry:*\n${data.message}\n`
    message += `\n⏰ *Sent:* ${new Date().toLocaleString("en-NG")}\n`

    return message
  }

  static sendToWhatsApp(data: WhatsAppMessage): void {
    let message: string

    switch (data.type) {
      case "order":
        message = this.generateOrderMessage(data)
        break
      case "receipt":
        message = this.generateReceiptMessage(data)
        break
      case "support":
        message = this.generateSupportMessage(data)
        break
      case "inquiry":
        message = this.generateInquiryMessage(data)
        break
      default:
        message = data.message
    }

    const whatsappUrl = `https://wa.me/${this.BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  static getBusinessWhatsAppUrl(): string {
    return `https://wa.me/${this.BUSINESS_NUMBER}`
  }

  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "")

    // Add country code if not present
    if (cleaned.startsWith("0")) {
      return "234" + cleaned.substring(1)
    } else if (!cleaned.startsWith("234")) {
      return "234" + cleaned
    }

    return cleaned
  }
}
