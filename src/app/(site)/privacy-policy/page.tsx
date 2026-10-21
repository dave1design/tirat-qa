import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

const TBC = <em className="text-muted"> Details to be confirmed before launch.</em>;

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" intro="Tirat QA respects your privacy and aims to handle your personal information responsibly.">
      <p>
        This page explains what information the platform collects, why it is collected, how it is used, and how users can exercise their privacy
        rights.
      </p>
      <LegalSection title="Information We Collect">
        <p>Depending on the features you use, Tirat QA may collect:</p>
        <ul>
          <li>Account information, such as your name and email address.</li>
          <li>Practice activity, including submitted bug reports and challenge results.</li>
          <li>Technical information needed to maintain and secure the service.</li>
          <li>Information you provide when contacting support.</li>
        </ul>
      </LegalSection>
      <LegalSection title="How We Use Information">
        <p>Information may be used to:</p>
        <ul>
          <li>Create and manage user accounts.</li>
          <li>Deliver practice challenges and save progress.</li>
          <li>Review submitted reports and provide results.</li>
          <li>Maintain platform security and reliability.</li>
          <li>Respond to support requests.</li>
          <li>Improve the platform.</li>
        </ul>
      </LegalSection>
      <LegalSection title="Data Security">
        <p>We use appropriate safeguards designed to protect personal information. No online system can guarantee absolute security.</p>
      </LegalSection>
      <LegalSection title="Data Sharing and Retention">
        <p>Which service providers process information, whether information is shared with others, and how long records are retained.{TBC}</p>
      </LegalSection>
      <LegalSection title="Your Rights">
        <p>
          How you can request access, correction, or deletion of your personal information, subject to applicable legal and operational requirements.
          {TBC}
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>For privacy questions, contact the platform using the official contact channel listed on the Contact page.</p>
      </LegalSection>
    </LegalPage>
  );
}
