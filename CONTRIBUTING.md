# 🤝 Contributing to ReliefGrid

First off, thank you for considering contributing to **ReliefGrid**! Mission-critical crisis infrastructure relies on precision, stability, and high engineering quality.

This document outlines the workflow and standards for submitting pull requests, reporting issues, and suggesting feature enhancements.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all contributors, reviewers, and users with respect and empathy.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
* Search existing [GitHub Issues](https://github.com/Maajolawasanjo/reliefgrid/issues) to ensure the bug hasn't already been reported.
* Open a new issue using the **Bug Report Template**.
* Provide detailed reproduction steps, expected behavior, system information, and error logs.

### 2. Feature Requests
* Open a new issue using the **Feature Request Template**.
* Clearly describe the real-world impact and crisis management utility of the proposed feature.

### 3. Submitting Code (Pull Requests)
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-agent-enhancement
   ```
2. Set up local backend and web environments (refer to [README.md](README.md)).
3. Ensure all Python code follows **Ruff** formatting standards and frontend code passes **TypeScript strict checking**:
   ```bash
   # Backend linting & tests
   ruff check apps/api
   pytest tests/
   
   # Frontend type-check & lint
   cd apps/web
   npx tsc --noEmit
   npm run lint
   ```
4. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(gis): optimize OSRM route hazard buffer calculation"
   ```
5. Push to your branch and submit a Pull Request targeting `main`.

---

## 📏 Branching & Commit Conventions

* **`main`**: Production release candidates.
* **`feature/<name>`**: New feature additions.
* **`fix/<name>`**: Bug fixes and hotfixes.
* **`docs/<name>`**: Documentation improvements.

### Commit Message Format
```
<type>(<scope>): <short description>

[optional detailed message body]
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

---

## 🧪 Testing Guidelines

All pull requests introducing backend logic or API endpoints MUST include corresponding unit or integration tests under `tests/`.

Run the full integration suite locally before creating a PR:
```bash
pytest tests/integration/test_api_flow.py -v
```

---

## 📬 Contact & Escalations

If you have questions regarding architecture or contributions, reach out to the project lead:

* **Maintainer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626
