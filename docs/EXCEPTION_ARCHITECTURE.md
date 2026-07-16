# ⚠️ Exception Architecture & Error Envelopes

ReliefGrid wraps all REST API error responses in unified Pydantic error envelopes (`ApiError`) featuring clear error codes, HTTP status mappings, and sanitizing raw stack traces.
