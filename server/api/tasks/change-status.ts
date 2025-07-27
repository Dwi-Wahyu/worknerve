import prisma from "~/lib/prisma";
import { Status } from "~/schema/task";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const id = query.id;
  const status = query.status;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Query",
    });
  }

  if (!status) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Query",
    });
  }

  try {
    await prisma.task.update({
      where: {
        id: parseInt(id.toString()),
      },
      data: {
        status: status as Status,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to change status",
      data: error,
    });
  }
});
