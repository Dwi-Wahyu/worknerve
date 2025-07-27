import { createError } from "h3";
import prisma from "~/lib/prisma";
import { createTaskSchema, CreateTaskSchemaType } from "~/schema/task";

export default defineEventHandler(async (event) => {
  let body: CreateTaskSchemaType;

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
    await createTaskSchema.validate(body, { abortEarly: false });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validationError.errors,
    });
  }

  try {
    const task = await prisma.task.create({
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
