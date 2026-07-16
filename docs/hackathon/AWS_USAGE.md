# ☁️ AWS Architecture & Cloud Services Specification

## 📌 Executive Summary

**ReliefGrid** utilizes **Amazon Web Services (AWS)** as its primary cloud AI foundation and scalable service framework. By leveraging **Amazon Bedrock**, ReliefGrid orchestrates high-performance foundation models (Anthropic Claude 3) to execute autonomous domain-specific agent reasoning during crisis management operations.

---

## 🛠️ AWS Services & Integration Matrix

| AWS Service | Component Role | Implementation Architecture |
| :--- | :--- | :--- |
| **Amazon Bedrock** | Core AI Agent Foundation | Powers reasoning loops for all 7 autonomous specialist agents via `boto3` Bedrock Runtime client. |
| **Anthropic Claude 3** | LLM Model Provider | Generates structured JSON action plans, risk assessments, and tactical broadcasts. |
| **AWS IAM / STS** | Security & Access Governance | Standardized IAM Role-based access control with least-privilege policies for Bedrock runtime execution. |
| **AWS Lambda (Architected Roadmap)** | Serverless Event Triggers | Asynchronous trigger execution for real-time telemetry processing and watchdog monitoring. |
| **Amazon S3 (Architected Roadmap)** | Binary Asset & Satellite Storage | Encrypted storage bucket for raw satellite imagery, drone footage, and responder voice logs. |

---

## 🤖 Amazon Bedrock Orchestration Architecture

### 1. Unified Bedrock Client Initialization
All AI agent modules interact with AWS Bedrock through a centralized, resilient client defined in `apps/api/app/core/bedrock.py`:

```python
import boto3
from app.core.config import settings

class BedrockService:
    def __init__(self):
        self.client = boto3.client(
            service_name="bedrock-runtime",
            region_name=settings.AWS_BEDROCK_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
```

### 2. Resilient Retry Strategy with Tenacity
External network latency spikes during disaster scenarios are mitigated using `tenacity` retry decorators:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def invoke_agent_reasoning(prompt: str, system_prompt: str) -> dict:
    # Safely invoke Bedrock Claude model with exponential backoff
    response = bedrock.invoke_model(...)
    return response
```

### 3. Structured Pydantic Schema Output Enforcement
To prevent unpredictable free-form text from disrupting automated command center workflows, all AWS Bedrock invocations enforce strict Pydantic schema contracts:

```json
{
  "recommended_actions": [
    {
      "action_title": "Dispatch Mobile Trauma Unit 4",
      "priority": "CRITICAL",
      "assigned_agency": "Medical Ops",
      "rationale": "Trauma center hospital capacity exceeded by 140%"
    }
  ]
}
```

---

## 🛡️ Security & Access Control

* **TLS 1.3 Data in Transit**: All communication between ReliefGrid backend instances and AWS Bedrock endpoints is encrypted over HTTPS TLS 1.3.
* **Environment Credential Isolation**: AWS keys are never committed to version control and are strictly injected via `.env` configuration files or IAM EC2 instance roles.

---

## 📬 Contact & Lead Architect

* **Maintainer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
