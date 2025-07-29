import { object, string, type InferType } from "yup";

export const loginSchema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

export type LoginSchemaType = InferType<typeof loginSchema>;

export const registerSchema = object({
  name: string().required("Required"),
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

export type RegisterSchemaType = InferType<typeof registerSchema>;
