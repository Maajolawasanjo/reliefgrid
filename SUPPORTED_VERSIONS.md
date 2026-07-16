# 📌 Supported Versions & Compatibility Matrix

This document defines the official support lifecycle, active maintenance windows, and runtime dependencies for **ReliefGrid**.

---

## 🚀 ReliefGrid Version Support Matrix

| Version | Release Date | Status | Security Patches | Bug Fixes |
| :--- | :--- | :--- | :--- | :--- |
| **v1.0.0-rc1** | July 2026 | **Active Release Candidate** | ✅ Active | ✅ Active |
| **v0.9.0** | June 2026 | End of Support | ❌ EOL | ❌ EOL |

---

## 🛠️ Infrastructure & Runtime Dependencies

| Dependency | Minimum Version | Recommended | Status / Compatibility |
| :--- | :--- | :--- | :--- |
| **Python** | `3.10.0` | `3.11.8+` | ✅ Fully Supported (Pydantic v2 & Asyncio) |
| **Node.js** | `18.17.0` | `20.11.0+` | ✅ Fully Supported (Next.js 14 App Router) |
| **CockroachDB**| `v23.2.0` | `v24.1.0+` | ✅ Fully Supported (`pgvector` HNSW index enabled) |
| **FastAPI** | `0.109.0` | `0.110.0+` | ✅ Active (OpenAPI 3.1 schema auto-generation) |
| **Next.js** | `14.1.0` | `14.2.35` | ✅ Active (Server Components & Tailwind CSS) |
| **Docker** | `24.0.0` | `25.0.0+` | ✅ Supported (Multi-stage production build) |

---

## 🌐 Browser Compatibility

ReliefGrid's dark-mode command console UI is optimized for modern web standards:

| Browser | Minimum Version | Rating |
| :--- | :--- | :--- |
| **Google Chrome / Chromium** | `100+` | 🟢 Full Support (Recommended) |
| **Mozilla Firefox** | `105+` | 🟢 Full Support |
| **Apple Safari** | `15.4+` | 🟢 Full Support |
| **Microsoft Edge** | `100+` | 🟢 Full Support |
| **Internet Explorer** | Any | 🔴 Unsupported |

---

## 📬 Maintenance Inquiries

For questions regarding legacy version migrations or security support extension:

* **Maintainer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
