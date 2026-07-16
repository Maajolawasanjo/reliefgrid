# ☁️ AWS Cloud Architecture Deep-Dive

## 📌 Service Integration

ReliefGrid relies on **Amazon Web Services (AWS)** for Foundation Model inferencing, security governance, and scalable cloud execution.

```
┌──────────────────┐      HTTPS / TLS 1.3      ┌──────────────────┐
│ FastAPI Backend  │ ────────────────────────► │ AWS Bedrock      │
│  Service Container│                          │ Runtime Endpoint │
└──────────────────┘                           └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │ Anthropic Claude3│
                                               │ AI Agents        │
                                               └──────────────────┘
```

---

## 🔒 Security & Policy Governance

* **IAM Policy Enforcement**: Least-privilege IAM access configuration allowing access strictly to `bedrock:InvokeModel`.
* **Zero Client-Side Exposure**: AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) are handled entirely server-side within Python environment configurations.
