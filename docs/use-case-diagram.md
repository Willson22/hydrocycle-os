# Use Case Diagram — HydroCycle OS MVP

This diagram defines the system boundaries, actors, and primary use cases for the MVP scope of the HydroCycle OS platform.

```mermaid
graph TB
    subgraph System ["🏭 HydroCycle OS MVP"]
        UC1["📊 UC1: Ingest Telemetry Data"]
        UC2["📍 UC2: Manage Measurement Points"]
        UC3["📈 UC3: View Client Dashboard"]
        UC4["💰 UC4: Calculate Financial & CO2 Savings"]
        UC5["📋 UC5: Generate ESG Report"]
    end

    Sensor["🤖 IIoT Sensor<br/>(Simulator)"]
    FM["👤 Facility Manager"]
    Auditor["👔 ESG Auditor"]
    Admin["🛠️ Admin"]

    Sensor -->|HTTP POST| UC1
    Admin -->|CRUD| UC2
    FM -->|CRUD| UC2
    FM -->|Read| UC3
    FM -->|Trigger| UC4
    FM -->|Generate| UC5
    Auditor -->|Export / Validate| UC5

    UC1 -.->|data flow| UC3
    UC4 -.->|results| UC3
    UC5 -.->|ESG metrics| UC3

    classDef usecase fill:#fff4e6,stroke:#ff6b35,stroke-width:2px,color:#000
    classDef actor fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#000
    classDef system fill:#f0f0f0,stroke:#333,stroke-width:3px
    
    class UC1,UC2,UC3,UC4,UC5 usecase
    class Sensor,FM,Auditor,Admin actor
    class System system