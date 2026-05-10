# Security Policy

## Supported Versions

Only the latest published version of TabLinkList is actively maintained.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Use [GitHub Private Security Advisories](https://github.com/shionit/tab-link-list/security/advisories/new)
to report a vulnerability privately. You can expect an initial response within 7 days.

## Scope

This extension requests only the `tabs` permission and never communicates with
external servers — all processing happens locally in the browser popup.

Vulnerabilities of interest include:

- Malicious code injected via a compromised dependency (supply chain attack)
- Content-Security-Policy bypasses in the extension popup
- Unintended clipboard data exfiltration
