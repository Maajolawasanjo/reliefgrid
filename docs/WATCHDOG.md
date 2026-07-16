# 🐕 Self-Healing Watchdog Engine Specification

The **Watchdog Process** scans CockroachDB task tables periodically for stale or stuck agent assignments. If an assignment exceeds its timeout threshold without completion, the Watchdog automatically resets the task state and dispatches a retry.
