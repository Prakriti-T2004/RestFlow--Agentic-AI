import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask {
  title: string;
  description?: string;
  resources?: string[];
  dueDate?: Date;
  priority?: number;
  prepStatus?: 'idle' | 'running' | 'completed' | 'failed';
  prepSummary?: string;
  prepSteps?: string[];
}

export interface IActivityLogEntry {
  stage: string;
  message: string;
  details?: string;
  createdAt?: Date;
}

export interface ISession extends Document {
  userId: string;
  resumeText?: string;
  extraContext?: string;
  company?: string;
  role?: string;
  deadline?: Date;
  competency?: string;
  agents?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentStep?: string;
  activityLog: IActivityLogEntry[];
  tasks: ITask[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  resources: { type: [String], default: [] },
  dueDate: { type: Date },
  priority: { type: Number, default: 0 },
});

const ActivityLogSchema = new Schema<IActivityLogEntry>({
  stage: { type: String, required: true },
  message: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true, index: true },
    resumeText: { type: String },
    extraContext: { type: String },
    company: { type: String },
    role: { type: String },
    deadline: { type: Date },
    competency: { type: String },
    agents: { type: [String], default: [] },
    status: { type: String, default: 'pending' },
    progress: { type: Number, default: 0 },
    currentStep: { type: String, default: 'queued' },
    activityLog: { type: [ActivityLogSchema], default: [] },
    tasks: { type: [TaskSchema], default: [] },
  },
  { timestamps: true }
);

const SessionModel: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default SessionModel;
