# Frontend Component Diagram - HydroCycle OS MVP

This document details the React component hierarchy and state management architecture for the B2B client dashboard. It adheres to strict modularity principles, ensuring reusable UI components and a clear separation between routing, state providers, and presentation.

```mermaid
flowchart TD
    %% State Management & Routing (App Root)
    subgraph App_Root ["src/App.tsx (Root)"]
        Router["BrowserRouter <br> (React Router)"]
        AuthProvider["AuthContext.Provider <br> (JWT State)"]
        ESGProvider["ESGDataContext.Provider <br> (Global Filters)"]
    end

    %% Main Layout Wrapper
    subgraph Layout ["Layout Components"]
        MainLayout["DashboardLayout <br> (Grid Template)"]
        Sidebar["SidebarNav <br> (Routing Links)"]
        TopNav["TopNavBar <br> (User Profile & Logout)"]
    end

    %% Views / Pages (Routable Components)
    subgraph Pages ["Pages (Route Components)"]
        Login["LoginPage <br> (Public Route)"]
        Dashboard["DashboardPage <br> (Protected Route)"]
        MeasurementPts["MeasurementPointsPage <br> (Protected Route)"]
        ESGReport["ESGReportingPage <br> (Protected Route)"]
    end

    %% Complex UI Components
    subgraph Dashboard_Components ["Dashboard Features"]
        WaterChart["WaterCycleChart <br> (Recharts: Telemetry Viz)"]
        StatCards["KpiCards <br> (Saved Litres, CO2, EUR)"]
    end

    subgraph Management_Components ["Point Management Features"]
        PointsList["SensorListTable <br> (DataGrid / Table)"]
        AddPointModal["AddSensorModal <br> (React Hook Form + Zod)"]
    end

    subgraph Report_Components ["ESG Features"]
        ReportTable["ESGDataTable <br> (Aggregated Savings Data)"]
        ExportBtn["PDFExportButton <br> (Generates Audit Report)"]
    end

    %% Data Flow & Hierarchy Wiring
    Router --> AuthProvider
    AuthProvider --> ESGProvider
    ESGProvider --> Login
    ESGProvider --> MainLayout

    MainLayout --> Sidebar
    MainLayout --> TopNav
    MainLayout --> Dashboard
    MainLayout --> MeasurementPts
    MainLayout --> ESGReport

    Dashboard --> StatCards
    Dashboard --> WaterChart

    MeasurementPts --> PointsList
    MeasurementPts --> AddPointModal

    ESGReport --> ReportTable
    ESGReport --> ExportBtn

    %% Styling for better readability
    classDef context fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px,color:#000;
    classDef layout fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,color:#000;
    classDef page fill:#e8f5e9,stroke:#43a047,stroke-width:2px,color:#000;
    classDef comp fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,color:#000;

    class App_Root context;
    class Layout layout;
    class Pages page;
    class Dashboard_Components,Management_Components,Report_Components comp;