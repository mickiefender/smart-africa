import { PageLayout } from "@/components/page-layout"

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
      </p>
      <p>
        Smart Africa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you use our digital business card services.
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect personal information that you provide to us directly, such as:</p>
      <ul>
        <li>Name, email address, phone number, and company details when you create a profile.</li>
        <li>Payment information when you purchase our products.</li>
        <li>Information you provide when you contact us for support.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and maintain our services.</li>
        <li>Process your transactions and manage your orders.</li>
        <li>Improve, personalize, and expand our services.</li>
        <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the service.</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information
        unless we provide users with advance notice. This does not include website hosting partners and other parties
        who assist us in operating our website, conducting our business, or serving our users, so long as those
        parties agree to keep this information confidential.
      </p>

      <h2>Security of Your Information</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information.
        While we have taken reasonable steps to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or impenetrable.
      </p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:smartafrica99@gmail.com">smartafrica99@gmail.com</a>.</p>
    </PageLayout>
  )
}