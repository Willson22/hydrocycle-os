# Component Diagram - HydroCycle OS MVP

This diagram illustrates the internal modular structure of the HydroCycle OS. It strictly enforces the N-Tier architectural pattern (Routes -> Controllers -> Services -> Data Access) and showcases the integration of the IIoT Simulator.

```mermaid
flowchart TD
    %% External Systems & Entry Points
    subgraph Edge ["Edge Devices"]
        Simulator["IIoT Sensor Simulator"]
    end

    subgraph Frontend ["React Frontend"]
        Client["Client Dashboard"]
    end

    %% Backend - Presentation Layer
    subgraph API ["API Layer (Express.js)"]
        IngestionRoutes["Ingestion Routes"]
        DashboardRoutes["Dashboard Routes"]
    end

    %% Backend - Controller Layer
    subgraph ControllersLayer ["Controllers"]
        TeleController["Telemetry Controller"]
        RepController["Report Controller"]
        BldgController["Building Controller"]
    end

    %% Backend - Business Logic Layer
    subgraph ServicesLayer ["Services (Business Logic)"]
        TeleService["Telemetry Ingestion Service"]
        ESGService["ESG Calculation Service"]
    end

    %% Backend - Data Access Layer (DAO)
    subgraph DAOLayer ["Data Access Layer (DAO)"]
        MongoDAO["Mongo Telemetry DAO"]
        PostgresDAO["Postgres Entity DAO"]
    end

    %% Databases (Polyglot Persistence)
    subgraph MongoDB ["MongoDB (Time-Series)"]
        TeleCollection[("Telemetry Collection")]
    end
    
    subgraph PostgreSQL ["PostgreSQL (Relational)"]
        EntitiesTables[("Entities & Savings Tables")]
    end

    %% Data Flow & Connections
    Client -- "HTTPS / JSON" --> DashboardRoutes
    Simulator -- "HTTPS / POST Payload" --> IngestionRoutes

    IngestionRoutes --> TeleController
    DashboardRoutes --> RepController
    DashboardRoutes --> BldgController

    TeleController --> TeleService
    RepController --> ESGService
    BldgController -- "requests data" --> ESGService

    TeleService --> MongoDAO
    ESGService --> PostgresDAO
    ESGService -- "fetches raw volume" --> MongoDAO

    MongoDAO --> TeleCollection
    PostgresDAO --> EntitiesTables

    %% Styling for better readability
    classDef layer fill:#f8f9fa,stroke:#dee2e6,stroke-width:2px,color:#212529;
    classDef ext fill:#e9ecef,stroke:#ced4da,stroke-width:2px,color:#495057;
    classDef db fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#212529;
    
    class API,ControllersLayer,ServicesLayer,DAOLayer layer;
    class Edge,Frontend ext;
    class MongoDB,PostgreSQL db;
    ```