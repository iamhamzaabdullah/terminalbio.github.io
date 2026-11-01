# geno

**Pedigree documentation workspace**

Created by **Hamza Abdullah**, terminalbio.

geno is an in-development, browser-based workspace for documenting family relationships and genetic information in pedigree form. It is intended to support genetics professionals and researchers with the organization and review of family history. The project's intended public address is [terminalbio.com/p/geno/](https://terminalbio.com/p/geno/).

## What geno does

- Creates a pedigree from person, parent and couple records, with up to five inferred generations.
- Records affected status, selected clinical information, and notes alongside the diagram.
- Opens editable backups and saves passphrase-encrypted backups using browser cryptography.
- Exports a PDF report with a searchable text layer for tested Latin and Greek examples.
- Works in a browser without an application server for the pedigree workspace.

## Current status and responsible use

geno is under development and has **not** undergone independent clinical validation, institutional security assessment, or professional society approval. It does not validate ISCN nomenclature, interpret genetic results, calculate risk, or provide a diagnosis. Qualified professionals must verify pedigrees and findings against source records and current guidance.

Parent links represent genetic parents. Adoption, twins, donor conception, assisted reproduction, pregnancy outcomes and other complex scenarios are recorded as text rather than complete standardized graphical representations. The automatic layout can cross or misrepresent relationships, and its warnings do not catch every issue. Do not rely on geno as a standalone clinical record.

## Privacy and security

Records are held in browser memory during a session; the application does not intentionally transmit pedigree data to a server. Encrypted backups use AES-256-GCM and PBKDF2 with a user-provided passphrase. A lost passphrase cannot be recovered. PDF exports and legacy JSON backups are **not encrypted**. The browser, device, extensions, hosting environment and handling of exported files remain outside geno's control.

The static application does not provide institutional authentication, access controls, audit logs, managed backups or key management. Before using real patient information, obtain the necessary institutional approvals and assess applicable privacy, security and regulatory requirements. See [implementation and safety boundaries](p/geno/README.md) for details.

## Run locally

From the repository root, start a local static server, for example:

```sh
python -m http.server 8000
```

Open [http://localhost:8000/p/geno/](http://localhost:8000/p/geno/) in a browser. Keep the directory structure intact: the application uses the shared terminalbio wordmark in `src/assets/`. Python is needed only for this example server; another static server can also be used.

To run the included encryption tests with a recent Node.js installation:

```sh
node --test scripts/geno-crypto.test.mjs
```

These tests cover selected backup operations; they are not a clinical or security validation.

## Repository contents

- `p/geno/` — application source, implementation notes and bundled dependencies.
- `src/assets/terminalbio-wordmark.svg` — terminalbio wordmark used by the application.
- `scripts/geno-crypto.test.mjs` — encryption and backup tests.
- `CITATION.cff` — machine-readable software citation for GitHub and archives.

## Cite geno

Abdullah H. *geno: Pedigree documentation workspace* [software]. terminalbio. Available at: https://terminalbio.com/p/geno/ (accessed date of use).

The repository includes a citation file with the creator's name and affiliation. If a version is archived and assigned a DOI, cite that specific version and its DOI. No DOI or peer-reviewed publication is claimed here.

## Reference

Hastings RJ, Moore S, Chia N, editors. *ISCN 2024: An International System for Human Cytogenomic Nomenclature*. Basel: Karger; 2024. [https://doi.org/10.1159/isbn.978-3-318-07331-7](https://doi.org/10.1159/isbn.978-3-318-07331-7). Consult the published erratum and current guidance as applicable. This reference does not imply that geno validates ISCN nomenclature or has been endorsed by its authors or publisher.

## Creator and attribution

geno was created by **Hamza Abdullah (terminalbio)**.

## Licensing

No license for the original geno source is specified in this package. The bundled third-party components retain their own licenses; their license notices are included in `p/geno/vendor/`. A license for geno should be selected and added before specifying reuse permissions.
