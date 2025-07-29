import { createError } from "h3";
import prisma from "~/lib/prisma";
import {
  updateCredentialSchema,
  UpdateCredentialSchemaType,
} from "~/schema/credentials";

export default defineEventHandler(async (event) => {
  let body: UpdateCredentialSchemaType;

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
    await updateCredentialSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const credential = await prisma.credential.update({
      where: {
        id: parseInt(body.id),
        userId: user.id,
      },
      data: {
        title: body.title,
        key: body.key,
        value: body.value,
        description: body.description,
        applicationId: body.applicationId,
        serverId: body.serverId,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error creating credential:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create credential",
      data: error,
    });
  }
});
