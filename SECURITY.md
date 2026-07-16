# 🛡️ Security Policy & Disclosure Guidelines

Security and data integrity are fundamental to **ReliefGrid**. Because the platform coordinates mission-critical disaster response logistics, we take security vulnerabilities and system resilience extremely seriously.

---

## 🔒 Reporting a Security Vulnerability

If you discover a potential security vulnerability in ReliefGrid, **please do not disclose it publicly** via GitHub issues, discussions, or social media.

Instead, please send a confidential security report directly to the security maintainer:

* **Security Maintainer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626

### What to Include in Your Security Report
* Description of the vulnerability and potential impact.
* Detailed steps to reproduce the issue (including sample curl payloads or code scripts).
* Proof-of-concept (PoC) if available.
* Any potential mitigation or fix recommendations.

---

## ⏱️ Response SLA & Disclosure Timeline

We commit to handling security issues according to the following SLAs:

1. **Initial Acknowledgment**: Within **24 hours** of report receipt.
2. **Triage & Severity Assessment**: Within **48 hours**.
3. **Patch Development & Verification**: Within **7 business days** (Critical vulnerabilities are prioritized for immediate hotfix within 24 hours).
4. **Public Advisory Release**: Published via GitHub Security Advisories after affected systems are patched.

---

## 🛡️ Core Security Architecture & Standards

ReliefGrid implements defense-in-depth security measures across all platform layers:

* **Authentication & JWT Enforcement**: Short-lived RS256/HS256 signed JWT Bearer tokens with strict expiration.
* **Granular Role-Based Access Control (RBAC)**: Enforced via FastAPI dependencies (`get_current_user`) for `ADMIN`, `COORDINATOR`, and `RESPONDER` access levels.
* **Database TLS Encryption**: Mandatory `sslmode=verify-full` connections to CockroachDB Serverless.
* **Rate Limiting**: Enforced rate limiting via `slowapi` on API endpoints (e.g. 5 requests/minute on authentication routes) to defend against brute force and denial of service.
* **Input Sanitization**: Pydantic v2 schema validation filtering all incoming payloads against SQL injection and cross-site scripting (XSS).
