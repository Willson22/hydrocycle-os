```mermaid
graph TB
    subgraph System ["🏭 HydroCycle OS MVP"]
        UC1["📊 UC1: Ingestovat telemetrická data"]
        UC2["📍 UC2: Spravovat odběrná místa"]
        UC3["📈 UC3: Zobrazit klientský dashboard"]
        UC4["💰 UC4: Vypočítat finanční a CO2 úsporu"]
        UC5["📋 UC5: Generovat ESG Report"]
    end

    Sensor["🤖 IIoT Senzor<br/>(Simulátor)"]
    FM["👤 Facility Manager"]
    Auditor["👔 ESG Auditor"]
    Admin["🛠️ Admin"]

    Sensor -->|HTTP POST| UC1
    Admin -->|CRUD| UC2
    FM -->|CRUD| UC2
    FM -->|Čtení| UC3
    FM -->|Spuštění| UC4
    FM -->|Sestavení| UC5
    Auditor -->|Export/Validace| UC5

    UC1 -.->|data flow| UC3
    UC4 -.->|výsledky| UC3
    UC5 -.->|ESG metriky| UC3

    classDef usecase fill:#fff4e6,stroke:#ff6b35,stroke-width:2px,color:#000
    classDef actor fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#000
    classDef system fill:#f0f0f0,stroke:#333,stroke-width:3px
    
    class UC1,UC2,UC3,UC4,UC5 usecase
    class Sensor,FM,Auditor,Admin actor
    class System system