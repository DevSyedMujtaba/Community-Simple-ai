import React from "react";

const PrivacyPolicy = () => (
  <div className="bg-white min-h-screen py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <a href="/" className="text-blue-600 text-sm font-semibold mb-8 inline-block">&larr; Back to Home</a>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <div className="text-gray-500 text-sm mb-8">Last Updated: June 25, 2025</div>
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">1.</span>Information We Collect</h2>
          <div className="mb-2 font-semibold">a. Information You Provide</div>
          <ul className="list-disc ml-6 mb-2">
            <li>Account registration details (name, email, password)</li>
            <li>Subscription or billing information</li>
            <li>Documents or data uploaded to the Platform</li>
            <li>Messages or support inquiries</li>
          </ul>
          <div className="mb-2 font-semibold">b. Automatically Collected Information</div>
          <ul className="list-disc ml-6">
            <li>IP address and browser type</li>
            <li>Device type and operating system</li>
            <li>Pages visited and usage data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">2.</span>How We Use Your Information</h2>
          <ul className="list-disc ml-6">
            <li>Operate, maintain, and improve the Platform</li>
            <li>Provide user support and respond to inquiries</li>
            <li>Process payments and manage subscriptions</li>
            <li>Develop new features and enhance user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">3.</span>Data Sharing and Disclosure</h2>
          <p className="mb-2">We do not sell your personal data. We may share information in the following limited circumstances:</p>
          <ul className="list-disc ml-6">
            <li><span className="font-semibold">Service Providers:</span> With third-party vendors who help operate our infrastructure under confidentiality agreements</li>
            <li><span className="font-semibold">Legal Compliance:</span> When required to comply with legal obligations or to protect rights, safety, or property</li>
            <li><span className="font-semibold">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">4.</span>Your Choices</h2>
          <ul className="list-disc ml-6">
            <li><span className="font-semibold">Access & Correction:</span> You can access and update your account information at any time.</li>
            <li><span className="font-semibold">Data Deletion:</span> You may request deletion of your account and associated data by contacting <a href="mailto:support@homeowner.simple" className="text-blue-600 underline">support@homeowner.simple</a></li>
            <li><span className="font-semibold">Cookies:</span> You can adjust browser settings to refuse or delete cookies; however, some features may not function properly</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">5.</span>Data Retention</h2>
          <p>We retain user data only as long as needed for the purposes described in this policy or to comply with applicable laws. Uploaded documents and account-related data may be deleted upon account cancellation, subject to a short backup retention window.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">6.</span>Data Security</h2>
          <p>We implement appropriate administrative, technical, and physical safeguards to protect your data. However, no method of transmission over the internet is 100% secure. You use the Platform at your own risk.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">7.</span>Children's Privacy</h2>
          <p>Homeowner.Simple is not intended for use by individuals under 18 years of age. We do not knowingly collect personal data from minors. If we learn that we have collected such data, we will delete it.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">8.</span>International Users</h2>
          <p>We primarily serve users in the United States. If you are accessing the Platform from outside the U.S., your information will be transferred to and processed in the United States.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">9.</span>Changes to this Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be announced via the Platform or email. Your continued use of the Platform after changes take effect constitutes acceptance of the revised policy.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">10.</span>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <ul className="list-disc ml-6">
            <li>📧 <a href="mailto:support@homeowner.simple" className="text-blue-600 underline">support@homeowner.simple</a></li>
            <li>📬 Euclid LLC, [Insert Wyoming business mailing address]</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 