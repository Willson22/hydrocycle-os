# Entity-Relation Diagram (Polygot Persistence) - HydroCycle OS MVP

This diagram represents the data architecture across two different database systems. The relational structure (PostgreSQL) is strictly enforced via Foreign Keys. The Time-Series collection (MongoDB) is loosely coupled via a logical link (Sensor MAC Address).

```mermaid
erDiagram
    %% --- PostgreSQL (Realtional) ---
    USERS ||--O{ BUILDING : "manages"
    USERS {
        UUID id PK
        VARCHAR email
        VARCHAR password_hash
        VARCHAR role
        TIMESTAMP created_at
    }

    BUILDING ||--O{ MEASUREMENT_POINTS : "contains"
    BUILDING ||--o{ AGGREGATED_SAVINGS : "has"
    BUILDING {
        UUID id pk
        UUID user_id FK
        VARCHAR name
        TEXT address
        TIMESTAMP created_at
    }

    MEASUREMENT_POINTS {
        UUID id PK
        UUID building_id PK
        VARCHAR location_name
        VARCHAR sensor_mac_adress "UNIQUE"
        TIMESTAMP created_at
    }

    AGGREGATED_SAVINGS {
        UUID id PK
        UUID building_id FK
        DATE peroid_start
        DATE peroid_end
        NUMERIC water_saved_liters
        NUMERIC co2_saved_kg
        NUMERIC financial_savings_eur
        TIMESTAMP updated_at
    }

    %% --- MongoDB (Time-Series) ---
    MEASUREMENT_POINTS |o--o{ TELEMETRY_RECORD : "Logical Ling (sensor_mac_address)"

    TELEMETRY_RECORD {
        ObjectID _id PK
        VARCHAR sensorMacAdress "Indexed (MetaField)"
        DATETIME timestamp "Indexed (Timefield)"
        FLOAT flowRate
        FLOAT volumeTotal
    }