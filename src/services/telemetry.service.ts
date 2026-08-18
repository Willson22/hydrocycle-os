import { TelemetryModel } from '../models/telemetry.model';
import { TelemetryCreateDtoIn } from '../dto/telemetry.dto';

export class TelemetryIngestionService {
    /**
     * Facade method to process incoming telemetry data.
     * Enforces fast response times by triggering calculations asynchronously.
     */
    public async processPayload(data: TelemetryCreateDtoIn): Promise<void> {
        // 1. Data Persistence (MongoDB Time-Series)
        const record = new TelemetryModel({
            sensorMacAddress: data.sensorMacAddress,
            timestamp: new Date(data.timestamp),
            flowRate: data.flowRate,
            volumeTotal: data.volumeTotal
        });

        await record.save();

        // 2. Asynchronous Event Trigger (Observer Pattern stub)
        // We do NOT await this. It runs in the background.
        this.notifySubscribers(data.sensorMacAddress, data.volumeTotal).catch(err => {
            console.error('[ERROR] Background ESG calculation failed:', err);
        });
    }

    private async notifySubscribers(macAddress: string, volume: number): Promise<void> {
        // TODO: Bridge to calculator Context and PostgreSQL
        console.log(`[EVENT] Telemetry saved. ESG calculation queued for MAC: ${macAddress}`);
    }
}

export const telemetryIngestionService = new TelemetryIngestionService();