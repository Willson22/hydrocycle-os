```mermaid
classDiagram
    %% --- RELAČNÍ ENTITY (PostgreSQL) ---
    class User {
        +UUID id
        +String email
        +String role
    }
    class Building {
        +UUID id
        +String name
        +String address
        +addMeasurementPoint(Point)
    }
     class MeasurementPoint {
        +UUID id
        +String locationName
        +String sensorMacAddress
    }

    %% --- TIME-SERIES ENTITY (MongoDB) ---
    class TelemetryRecord {
        +ObjectId _id
        +String sensorMacAddress
        +DateTime timestamp
        +Float flowRate
        +Float volumeTotal
    }

    %% --- SLUŽBY A NÁVRHOVÉ VZORY ---
    class TelemetryIngestionService {
        <<Facade / Observer>>
        +processPayload(data)
        -validateData()
        -notifySubscribers()
    }

    class CalculatorContext {
        <<Strategy Context>>
        -IESGStrategy strategy
        +setStrategy(IESGStrategy)
        +calculateSavings(Building)
    }

    class IESGStrategy {
        <<Interface>>
        +computeCO2Equivalent(volume)
        +computeFinancialSavings(volume)
    }

    class EU_ESGStrategy {
        +computeCO2Equivalent(volume)
        +computeSavings(volume)
    }

    class Local_ESGStrategy {
        computeCO2Equivalent(volume)
        computeSavings(volume)
    }
    
    %% --- VAZBY A RELACE ---
    Building "1" *-- "many" MeasurementPoint : obsahuje
    User "many" -- "many" Building : spravuje
    MeasurementPoint "1" --> "many" TelemetryRecord : generuje

    TelemetryIngestionService ..> TelemetryRecord : ukládá
    CalculatorContext o--> IESGStrategy : využívá
    IESGStrategy <|.. EU_ESGStrategy : implementuje
    IESGStrategy <|.. Local_ESGStrategy : implementuje