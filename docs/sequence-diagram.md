# Sequence Diagram - HydroCycle OS MPp

This diagram visualizes the critical path of the MVP: the telemetry data ingestion process. It demonstrates the MVC data flow, the Facade pattern for service abstraction, and the asynchrounous Observer pattern used for Polygot Persistence updates.

```mermaid
sequenceDiagram
autonumber
    participant Sensor as 🤖 IIoT Sensor (Simulator)
    participant API as 🌐 Express Router
    participant Facade as ⚙️ TelemetryIngestionService
    participant Mongo as 🍃 MongoDB (Time-Series)
    participant Calc as 🧮 CalculatorContext
    participant DB as 🐘 PostgreSQL (Aggregation)

    Sensor->>API: POST /api/v1/telemetry (JSON payload)
    activate API
    API->>Facade: processPayload(payload)
    activate Facade

    Facade->>Facade: validateData() & deduplicate()

    Facade->>Mongo: insertOne(TelemetryRecord)
    activate Mongo
    Mongo-->>Facade: success (ack)
    deactivate Mongo

    %% Asynchronous event triggering (Observer)
    Facade-)Calc: notifySubscribers(newTelemetryData)
    Note right of Facade: Observer pattern triggers<br/>async savings calculation

    %% Synchronous response back to the client
    Facade-->>API: { status: "success" }
    deactivate Facade
    API-->>Sensor: HTTP 201 Created
    deactivate API

    %% Background processing
    activate Calc
    Calc->>DB: updateAggregatedSavings(buildingId)
    activate DB
    DB-->>Calc: ok
    deactivate DB
    deactivate Calc
```