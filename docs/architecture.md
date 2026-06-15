flowchart LR
    %% Aktoři
    Sensor["🤖 IIoT Senzor (Simulátor)"]
    FM["👤 Facility Manager"]
    Auditor["👔 ESG Auditor"]
    Admin["🛠️ Admin"]

    %% Hranice systému (System Boundary)
    subgraph HydroCycle_OS [B2B SaaS Platforma: HydroCycle OS MVP]
        direction TB
        UC1([UC1: Ingestovat telemetrická data])
        UC2([UC2: Spravovat odběrná místa])
        UC3([UC3: Zobrazit klientský dashboard])
        UC4([UC4: Vypočítat finanční a CO2 úsporu])
        UC5([UC5: Generovat ESG Report])
    end

    %% Vazby Actor -> Use Case
    Sensor -->|HTTP POST payload| UC1
    
    Admin -->|CRUD operace| UC2
    FM -->|Čtení/Zápis| UC2
    
    FM -->|Zobrazení vizualizací| UC3
    
    FM -->|Spuštění/Náhled| UC4
    
    FM -->|Sestavení| UC5
    Auditor -->|Export/Validace| UC5

    %% Stylování pro lepší přehlednost na GitHubu
    classDef usecase fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class UC1,UC2,UC3,UC4,UC5 usecase;
    classDef actor fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class Sensor,FM,Auditor,Admin actor;
