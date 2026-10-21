import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

const TBC = <em className="text-muted"> Details to be confirmed before launch.</em>;

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" intro="These terms explain the conditions for accessing and using Tirat QA.">
      <LegalSection title="Acceptable Use">
        <p>Users must use the platform responsibly and comply with the instructions provided for each practice challenge.</p>
      </LegalSection>
      <LegalSection title="Practice Environment">
        <p>Practice websites are intended for learning and testing. Users should only test systems for which they have explicit authorization.</p>
      </LegalSection>
      <LegalSection title="Accounts">
        <p>Users are responsible for maintaining the security of their login credentials and providing accurate account information.</p>
      </LegalSection>
      <LegalSection title="Practice Results">
        <p>
          Scores and feedback reflect the platform&apos;s configured review process. They should not be represented as a guarantee of professional
          certification or employment.
        </p>
      </LegalSection>
      <LegalSection title="Platform Availability">
        <p>Tirat QA may update, maintain, or modify features as the platform develops. Service availability may occasionally be interrupted.</p>
      </LegalSection>
      <LegalSection title="Intellectual Property">
        <p>Ownership and permitted use of the platform, its content, practice websites, and learning materials.{TBC}</p>
      </LegalSection>
      <LegalSection title="Changes to These Terms">
        <p>How updated terms will be communicated and when they take effect.{TBC}</p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>For questions about these terms, use the Contact page.</p>
      </LegalSection>
    </LegalPage>
  );
}
