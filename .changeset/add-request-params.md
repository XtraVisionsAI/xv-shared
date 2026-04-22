---
'@xv-shared/core': minor
---

Add `params` support to HttpClient for query string serialization. `RequestOptions` now accepts a `params` field that is automatically serialized to query string, filtering out null/undefined values.
