# geno: current implementation and safety boundaries

Created by Hamza Abdullah (terminalbio).

geno is an in-development pedigree documentation tool. It does not validate ISCN descriptions, calculate risk, diagnose, or provide treatment recommendations. It has not undergone independent clinical or institutional security validation.

## Data handling

- Data is held in page memory during a session. The application does not intentionally send patient data to a server. It loads the interface and fonts locally from the website. The host, browser, device, extensions and network environment remain outside the application's control.
- The encrypted backup uses browser Web Crypto with AES-256-GCM, a fresh random salt and IV, and PBKDF2-HMAC-SHA256 (600,000 iterations). A lost passphrase cannot be recovered. The application also accepts legacy unencrypted JSON backups, which should be protected and retained according to institutional policy.
- PDF reports are **not encrypted**. Save and transfer them only with institution-approved safeguards. PDF text layers are searchable for tested Latin and Greek examples; coverage, extraction fidelity and assistive-technology support for all scripts are not established.
- The static GitHub Pages deployment does not provide user authentication, role-based authorization, centralized storage, audit logs, managed backups, breach response or institutional key management. Encryption alone does not establish compliance with any healthcare privacy law.

## Pedigree representation

Affected, unaffected and unknown states are distinct. The app allows up to five inferred generations and records genetic parents and couple relationships. Adoption, twins, donors, assisted reproduction, pregnancy outcomes and other complex scenarios are captured as text only: their standard symbols and relationship semantics are not fully implemented. Automated layout can cross lines or otherwise mislead. A warning detects some but not all overlaps. A clinician must verify all relationships, symbols, and labels; the app is not suitable as a standalone clinical record.

## Evidence still required

Independent genetic-counselor review of representative and difficult cases, accessibility and cross-browser testing, clinically reviewed symbol and layout acceptance criteria, security assessment, institutional approvals, regulatory analysis by jurisdiction, and formal release/version/DOI work remain outstanding. No professional society or institution has approved or endorsed this software.

## Verification performed

`node --test scripts/geno-crypto.test.mjs` checks encryption/decryption, wrong passwords, tampering, and short passphrases. Local browser checks have exercised encrypted backup save/open and a sample PDF. These tests are limited and do not constitute clinical validation or penetration testing.
