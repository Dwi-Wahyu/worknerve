import { createError } from "h3";
import prisma from "~/lib/prisma";
import { updateTaskSchema, UpdateTaskSchemaType } from "~/schema/task";

export default defineEventHandler(async (event) => {
  let body: UpdateTaskSchemaType;

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
    await updateTaskSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const task = await prisma.task.update({
      where: {
        id: parseInt(body.id),
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        urgency: body.urgency,
        userId: user.id,
      },
    });

    return task;
  } catch (error: any) {
    console.error("Error creating credential:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create credential",
      data: error,
    });
  }
});
