# ReliefGrid High-Level Monorepo Architecture

```text
                                  +-------------------+
                                  | Operator Next.js  |
                                  | Frontend Browser  |
                                  +---------+---------+
                                            |
                                            v (REST / JSON)
                                  +-------------------+
                                  |   FastAPI Core    |
                                  |   API Gateway     |
                                  +----+---------+----+
                                       |         |
                  +--------------------+         +--------------------+
                  |                                                   |
                  v                                                   v
      +-----------------------+                           +-----------------------+
      | CockroachDB Memory    |                           | Multi-Agent Engine    |
      | pgvector Vector Store |                           | Amazon Bedrock Models |
      +-----------------------+                           +-----------------------+
```
