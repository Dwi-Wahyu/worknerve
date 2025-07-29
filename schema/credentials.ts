import { object, string, number, type InferType } from "yup";

export const createCredentialSchema = object({
  title: string()
    .min(3, "Title minimal 3 karakter")
    .required("Key wajib diisi"),
  key: string().min(3, "Key minimal 3 karakter").required("Key wajib diisi"),
  value: string().min(1, "Value wajib diisi").required("Value wajib diisi"),
  description: string().optional(),
  serverId: number().nullable().optional(),
  applicationId: number().nullable().optional(),
});

export type CreateCredentialSchemaType = InferType<
  typeof createCredentialSchema
>;

export const updateCredentialSchema = object({
  id: string().required("Id required"),
  title: string()
    .min(3, "Title minimal 3 karakter")
    .required("Key wajib diisi"),
  key: string().min(3, "Key minimal 3 karakter").required("Key wajib diisi"),
  value: string().min(1, "Value wajib diisi").required("Value wajib diisi"),
  description: string().optional(),
  serverId: number().nullable().optional(),
  applicationId: number().nullable().optional(),
});

export type UpdateCredentialSchemaType = InferType<
  typeof updateCredentialSchema
>;

export type CredentialType = {
  id: number;
  title: string;
  key: string;
  value: string;
  description?: string;
  serverId: number | null;
  applicationId: number | null;
};
