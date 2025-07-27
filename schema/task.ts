import { mixed, object, string, type InferType } from "yup";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  urgency: Urgency;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Urgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Status =
  | "PENDING"
  | "PROGRESS"
  | "BLOCKED"
  | "COMPLETED"
  | "CANCELLED";

export const createTaskSchema = object({
  title: string()
    .min(3, "Judul minimal 3 karakter")
    .required("Judul tugas wajib diisi"),
  description: string().nullable().optional(),
  status: mixed<Status>()
    .oneOf(
      ["PENDING", "PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"],
      "Status tidak valid"
    )
    .default("PENDING"),
  urgency: mixed<Urgency>()
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Urgensi tidak valid")
    .required("Urgensi wajib dipilih"),
});

export type CreateTaskSchemaType = InferType<typeof createTaskSchema>;
