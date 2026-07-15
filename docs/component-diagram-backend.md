# Component Diagram - HydroCycle OS MVP

This diagram illustrates the internal modular structure of the HydroCycle OS. It strictly enforces the N-Tier architectural pattern (Routes -> Controllers -> Services -> Data Access) and showcases the integration of the IIoT Simulator.

```mermaid
componentDiagram
    %% External Systems & Entry Points
    package "Edge Devices" {
        [IIoT Sensor Simulator]
    }

    package "React Frontend" {
        [Client Dashboard]
    }

    %% Backend - Presentation Layer
    package "API Layer (Express.js)" {
        [Ingestion Routes]
        [Dashboard Routes]
        
        [Client Dashboard] --> [Dashboard Routes] : HTTPS / JSON
        [IIoT Sensor Simulator] --> [Ingestion Routes] : HTTPS / POST Payload
    }

    %% Backend - Controller Layer
    package "Controllers" {
        [Telemetry Controller]
        [Report Controller]
        [Building Controller]
        
        [Ingestion Routes] --> [Telemetry Controller]
        [Dashboard Routes] --> [Report Controller]
        [Dashboard Routes] --> [Building Controller]
    }

    %% Backend - Business Logic Layer
    package "Services (Business Logic)" {
        [Telemetry Ingestion Service]
        [ESG Calculation Service]
        
        [Telemetry Controller] --> [Telemetry Ingestion Service]
        [Report Controller] --> [ESG Calculation Service]
        [Building Controller] --> [ESG Calculation Service] : "requests data"
    }

    %% Backend - Data Access Layer (DAO)
    package "Data Access Layer (DAO)" {
        [Mongo Telemetry DAO]
        [Postgres Entity DAO]
        
        [Telemetry Ingestion Service] --> [Mongo Telemetry DAO]
        [ESG Calculation Service] --> [Postgres Entity DAO]
        [ESG Calculation Service] --> [Mongo Telemetry DAO] : "fetches raw volume"
    }

    %% Databases (Polyglot Persistence)
    database "MongoDB (Time-Series)" {
        [Telemetry Collection]
    }
    
    database "PostgreSQL (Relational)" {
        [Entities & Savings Tables]
    }

    [Mongo Telemetry DAO] --> [Telemetry Collection]
    [Postgres Entity DAO] --> [Entities & Savings Tables]
    ```