import { createError } from "h3";
import prisma from "~/lib/prisma";
import {
  CreateCredentialPayload,
  createCredentialSchema,
} from "~/schema/credentials";

export default defineEventHandler(async (event) => {
  let body: CreateCredentialPayload;

  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    body = await readBody(event);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }

  try {
    await createCredentialSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const newCredential = await prisma.credential.create({
      data: {
        title: body.title,
        key: body.key,
        value: body.value,
        description: body.description,
        serverId: body.serverId || null,
        applicationId: body.applicationId || null,
        userId: user.id,
      },
    });
    return newCredential;
  } catch (error: any) {
    console.error("Error creating credential:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create credential",
      data: error,
    });
  }
});
