# ESG Savings Calculation Activity Diagram - HydroCycle OS MVP

This activity diagram visualizes the core business logic of the HydroCycle OS application: the process of aggregating telemetry data and calculating financial and ecological savings.

The calculation runs asynchronously on the Service layer (CalculatorContext), bridging the gap between the Time-Series database (MongoDB) and the relational database (PostgreSQL).

```mermaid
flowchart TD
    %% Node and shape definitions
    Start((Start))
    EndNode((End))

    Req["Receive calculation request <br> <i>(BuildingID, DateRange)</i>"]
    Fetch[("Query MongoDB <br> for Time-Series data")]
    Cond{"Do data exist <br> for the given period?"}

    CalcVolume["Aggregate flow volume <br> <i>(Sum of greywater liters)</i>"]

    %% Parallel processing (Fork/Join) // Enabled by Node.js method Promise.all()
    Fork1(( ))
    Fork2(( ))

    CalcCO2["Calculate CO2 footprint <br> <i>(Volume * EU_ESG_Factor)</i>"]
    CalcFin["Calculate financial savings <br> <i>(Volume * Price per m3)</i>"]

    Join(( ))

    Save[("Save to PostgreSQL <br> AGGREGATED_SAVINGS table")]
    Return["Return DTO / Update report state"]
    Err["Write to error log <br> and return 404/400"]

    %% Logic flow
    Start --> Req
    Req --> Fetch
    Fetch --> Cond

    Cond -- No --> Err
    Err --> EndNode

    Cond -- Yes --> CalcVolume

    %% Branching for parallel calculations
    CalcVolume --> Fork1
    CalcVolume --> Fork2

    Fork1 --> CalcCO2
    Fork2 --> CalcFin

    CalcCO2 --> Join
    CalcFin --> Join

    %% Join and save
    Join --> Save
    Save --> Return
    Return --> EndNode

    %% Styling for better readability
    classDef database fill:#f9dbbd,stroke:#d08c60,stroke-width:2px,color:#000;
    classDef calculation fill:#d4e09b,stroke:#a6b96f,stroke-width:2px,color:#000;
    classDef startend fill:#333,color:#fff;
    
    class Fetch,Save database;
    class CalcVolume,CalcCO2,CalcFin calculation;
    class Start,EndNode startend;
```