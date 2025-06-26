import React from "react";

const TermsAndConditions = () => (
  <div className="bg-white min-h-screen py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <a href="/" className="text-blue-600 text-sm font-semibold mb-8 inline-block">&larr; Back to Home</a>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
      <div className="text-gray-500 text-sm mb-8">Last Updated: June 25, 2025</div>
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">1.</span>Legal Entity & Limited Liability</h2>
          <p>Homeowner.Simple is owned and operated by Euclid LLC, a company organized under the laws of the State of Wyoming. As such, the members, managers, and officers of Euclid LLC shall not be personally liable for the obligations or liabilities of the company, to the fullest extent permitted by Wyoming law.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">2.</span>Eligibility</h2>
          <p>To access and use the Platform, you must be at least 18 years of age and legally competent to enter into contracts.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">3.</span>Scope of Services</h2>
          <p>Homeowner.Simple provides tools to support HOA compliance and education, including but not limited to:</p>
          <ul className="list-disc ml-6 mb-2">
            <li>AI-powered compliance summaries</li>
            <li>Document analysis and automated Q&A</li>
            <li>Legal content aggregation and optional human attorney review</li>
          </ul>
          <p>We are not a law firm, and use of the Platform does not create an attorney-client relationship, unless explicitly agreed in writing via separately executed engagement terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">4.</span>SaaS Nature and Deployment</h2>
          <p>This Platform is provided on a software-as-a-service (SaaS) basis. You understand and agree that:</p>
          <ul className="list-disc ml-6 mb-2">
            <li>We may update, modify, or discontinue features at any time without prior notice</li>
            <li>You are responsible for maintaining backup copies of your data</li>
            <li>Uptime is targeted but not guaranteed; planned maintenance or third-party service interruptions may affect availability</li>
          </ul>
          <p>We may log changes via a versioning and changelog system accessible at [insert link] to ensure transparency around feature updates and service-level adjustments.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">5.</span>Data & User Responsibilities</h2>
          <p>You are solely responsible for:</p>
          <ul className="list-disc ml-6 mb-2">
            <li>Inputting accurate data</li>
            <li>Reviewing any automated or AI-generated output before relying on it</li>
            <li>Complying with all applicable HOA regulations and laws in your jurisdiction</li>
          </ul>
          <p>You grant us a limited license to use your uploaded content solely to operate and improve the Platform.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">6.</span>Subscriptions and Billing</h2>
          <p>We offer both free and paid plans. By selecting a paid plan, you agree to:</p>
          <ul className="list-disc ml-6 mb-2">
            <li>Pay applicable subscription fees</li>
            <li>Authorize recurring charges until you cancel</li>
            <li>Cancel your subscription before renewal to avoid additional charges</li>
          </ul>
          <p>No refunds will be issued for partially used subscription periods.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">7.</span>Intellectual Property</h2>
          <p>All content, tools, code, design elements, and branding associated with Homeowner.Simple are the property of Euclid LLC or its licensors.</p>
          <p>You may not reproduce, modify, distribute, or create derivative works without our written consent.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">8.</span>Termination</h2>
          <p>We reserve the right to suspend or terminate your account if you violate these Terms or misuse the Platform.</p>
          <p>You may cancel at any time. Your data will be retained for a limited period post-cancellation and may be permanently deleted afterward.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">9.</span>Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Euclid LLC and its affiliates disclaim any liability for:</p>
          <ul className="list-disc ml-6 mb-2">
            <li>Errors or omissions in content or functionality</li>
            <li>Loss of data, profits, or goodwill</li>
            <li>Indirect, incidental, or consequential damages</li>
          </ul>
          <p>Liability is strictly limited to the amount paid by you in the prior 12 months.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">10.</span>Governing Law & Jurisdiction</h2>
          <p>These Terms are governed by the laws of the State of Wyoming, without regard to conflict of law rules.</p>
          <p>Any legal action shall be brought in the state or federal courts located in Laramie County, Wyoming, and you consent to exclusive jurisdiction therein.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">11.</span>Modifications and Changelog</h2>
          <p>We may modify these Terms at any time. Material changes will be logged in our [Changelog] and communicated via email or in-app notices.</p>
          <p>Continued use after changes indicates acceptance of the updated Terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><span className="text-blue-600 font-bold mr-2">12.</span>Contact Information</h2>
          <p>If you have questions about these Terms, contact us at:</p>
          <ul className="list-disc ml-6">
            <li>📧 <a href="mailto:support@homeowner.simple" className="text-blue-600 underline">support@homeowner.simple</a></li>
            <li>📬 Euclid LLC, [Insert Wyoming business mailing address]</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

export default TermsAndConditions; 