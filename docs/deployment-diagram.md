# Deployment Diagram - HydroCycle OS MVP

This diagram defines the physical and cloud infrastructure deployment for the HydroCycle OS MVP. It demonstrates a stateless backend architecture utilizing a polyglot persistence strategy across distinct managed database services.

```mermaid
graph TD
    %% Client Nodes
    subgraph Client_Environment ["Client Environment"]
        Browser["Web Browser <br> (Facility Manager)"]
    end

    subgraph Edge_Environment ["Edge Environment (Local/Linux)"]
        Simulator["IIoT Simulator Script <br> (Node.js)"]
    end

    %% Cloud Hosting
    subgraph Vercel ["Vercel (Static / CDN)"]
        SPA["React.js Dashboard <br> (Static Assets)"]
    end

    subgraph Render ["Render (PaaS)"]
        API["Node.js / Express API <br> (Stateless Container)"]
    end

    %% Managed Databases
    subgraph Supabase ["Supabase (Managed DB)"]
        Postgres[("PostgreSQL <br> (Relational Data)")]
    end

    subgraph MongoDB_Atlas ["MongoDB Atlas (Managed DB)"]
        Mongo[("MongoDB <br> (Time-Series Data)")]
    end

    %% Communication Protocols
    Browser -- "HTTPS (Download UI)" --> SPA
    Browser -- "HTTPS (REST Calls)" --> API
    Simulator -- "HTTPS (POST /telemetry)" --> API
    
    API -- "TCP (pg connection)" --> Postgres
    API -- "TCP (Mongoose connection)" --> Mongo

    %% Styling
    classDef cloud fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef edge fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,color:#000;
    classDef db fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000;
    
    class Vercel,Render cloud;
    class Client_Environment,Edge_Environment edge;
    class Supabase,MongoDB_Atlas db;