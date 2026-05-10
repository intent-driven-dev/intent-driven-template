# C4 Diagram Templates

Use these as starting points. Replace generic labels with domain names from the codebase or proposed system.

## System Context

```text
+----------+        uses        +------------------+
|  Person  | -----------------> | Software System  |
+----------+                    +------------------+
                                      |
                                      | calls
                                      v
                               +------------------+
                               | External System  |
                               +------------------+
```

```mermaid
flowchart LR
  person[Person]
  system[Software System]
  external[External System]

  person -->|uses| system
  system -->|calls| external
```

## Container

```text
+----------+      HTTPS       +-------------------------------+
|  Person  | ---------------> |        Software System        |
+----------+                  |                               |
                              |  +-----+   calls   +-------+  |
                              |  | Web | --------> |  API  |  |
                              |  +-----+           +-------+  |
                              |                    |          |
                              |                    v          |
                              |                 +----+        |
                              |                 | DB |        |
                              |                 +----+        |
                              +-------------------------------+
```

```mermaid
flowchart LR
  person[Person]
  web[Web App]
  api[API Service]
  db[(Database)]

  person -->|HTTPS| web
  web -->|calls| api
  api -->|reads/writes| db
```

## Component

```text
Container: API Service

+--------------------------------------------+
|                 API Service                |
|                                            |
|  +------------+   uses   +--------------+  |
|  | Controller | -------> | Application  |  |
|  +------------+          | Service      |  |
|                          +--------------+  |
|                                  |         |
|                                  v         |
|                          +--------------+  |
|                          | Repository   |  |
|                          +--------------+  |
+--------------------------------------------+
```

```mermaid
flowchart LR
  controller[Controller]
  service[Application Service]
  repository[Repository]
  db[(Database)]

  controller -->|uses| service
  service -->|uses| repository
  repository -->|reads/writes| db
```

## Dynamic

```text
Person -> Web App -> API Service -> Database
  |         |           |              |
  | submit  |           |              |
  +-------->| validate  |              |
  |         +---------->| persist      |
  |         |           +------------->|
  |         | response  |              |
  |<--------+-----------+--------------+
```

```mermaid
sequenceDiagram
  actor Person
  participant Web as Web App
  participant API as API Service
  participant DB as Database

  Person->>Web: Submit request
  Web->>API: Validate and send command
  API->>DB: Persist data
  DB-->>API: Confirm write
  API-->>Web: Return result
  Web-->>Person: Show outcome
```

## Deployment

```text
+---------------- Cloud / Network ----------------+
|                                                  |
|  +--------------+       +---------------------+  |
|  | Web Runtime  | ----> | Service Runtime     |  |
|  +--------------+       +---------------------+  |
|                                  |               |
|                                  v               |
|                           +------------+         |
|                           | Managed DB |         |
|                           +------------+         |
+--------------------------------------------------+
```

```mermaid
flowchart LR
  subgraph network[Cloud / Network]
    web[Web Runtime]
    service[Service Runtime]
    db[(Managed DB)]
  end

  web -->|internal HTTP| service
  service -->|database connection| db
```
