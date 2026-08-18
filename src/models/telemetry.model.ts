import { Schema, model, Document } from 'mongoose';

export interface ITelemetryRecord extends Document {
    sensorMacAddress: string;
    timestamp: Date;
    flowRate: number;
    volumeTotal: number;
    createdAt: Date;
}

const telemetrySchema = new Schema<ITelemetryRecord>({
    sensorMacAddress: { 
        type: String, 
        required: true, 
        index: true,
        trim: true 
    },
    timestamp: { 
        type: Date, 
        required: true, 
        index: true 
    },
    flowRate: { 
        type: Number, 
        required: true 
    },
    volumeTotal: { 
        type: Number, 
        required: true 
    }
}, {
    timestamps: true,
    collection: 'telemetry_records'
});

export const TelemetryModel = model<ITelemetryRecord>('TelemetryRecord', telemetrySchema);