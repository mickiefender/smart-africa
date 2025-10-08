# Smart Africa Digital Business Cards

A modern, feature-rich platform for creating and managing digital business cards, built specifically for African entrepreneurs and professionals.

## Features

### 🚀 Core Features
- **Digital Business Card Creation**: Easy-to-use interface for creating professional digital cards
- **Real-time Payment Processing**: Integrated Paystack payment system with live updates
- **WhatsApp Integration**: Instant customer support and order notifications
- **Receipt Generation**: Beautiful, downloadable receipts with WhatsApp sharing
- **Responsive Design**: Optimized for all devices and screen sizes

### 💳 Payment System
- **Paystack Integration**: Secure Nigerian payment processing
- **Real-time Updates**: WebSocket-powered payment status updates
- **Multiple Plans**: Starter, Professional, and Enterprise tiers
- **Receipt Generation**: Automatic receipt creation and download
- **WhatsApp Receipts**: One-click receipt sharing to business WhatsApp

### 📱 WhatsApp Features
- **Floating Support Button**: Always-available customer assistance
- **Order Notifications**: Automatic order alerts to business WhatsApp
- **Receipt Sharing**: Direct receipt sharing with formatted messages
- **Support Requests**: Structured support ticket creation
- **General Inquiries**: Easy customer inquiry system

### 🎨 Design System
- **Modern UI**: Clean, professional design with orange and teal branding
- **Mobile-First**: Responsive design optimized for African mobile usage
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized loading and smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Payment**: Paystack API integration
- **Real-time**: WebSocket for live updates
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Paystack account for payment processing

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/smart-africa-cards.git
cd smart-africa-cards
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables:
- Add your Paystack public and secret keys
- Set your WhatsApp business number
- Configure callback URLs

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

\`\`\`env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/payment/callback

# WhatsApp Business Number
WHATSAPP_BUSINESS_NUMBER=2341234567890
\`\`\`

## API Routes

### Payment Endpoints
- `POST /api/payment/initialize` - Initialize Paystack payment
- `POST /api/payment/verify` - Verify payment status

### Payment Callback
- `GET /payment/callback` - Handle Paystack payment callbacks

## Features Overview

### Contact Form with Payment
- Real-time form validation
- Instant WhatsApp notifications
- Direct payment integration
- Quote request system

### Payment Processing
- Secure Paystack integration
- Real-time payment status updates
- Automatic receipt generation
- WhatsApp receipt sharing

### Customer Support
- Floating WhatsApp button
- Structured message templates
- Order tracking integration
- Multi-language support ready

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Setup for Production
- Update `NEXT_PUBLIC_BASE_URL` to your production domain
- Use production Paystack keys
- Configure production WhatsApp number
- Set up WebSocket server for real-time features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@smartafrica.com or join our WhatsApp support channel.

## Acknowledgments

- Built with Next.js and Tailwind CSS
- Payment processing by Paystack
- UI components by shadcn/ui
- Icons by Lucide React
