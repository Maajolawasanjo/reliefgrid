# 🔢 Platform Error Codes Catalog

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `ERR_AUTH_EXPIRED` | `401 Unauthorized` | JWT bearer token has expired. |
| `ERR_FORBIDDEN` | `403 Forbidden` | Operator role lacks required permission. |
| `ERR_INCIDENT_NOT_FOUND` | `404 Not Found` | Specified incident ID does not exist in CockroachDB. |
| `ERR_VECTOR_FAIL` | `500 Internal Error` | CockroachDB vector embedding calculation failed. |
