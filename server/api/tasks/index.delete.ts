import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const id = query.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Query",
    });
  }

  try {
    await prisma.task.delete({
      where: {
        id: parseInt(id.toString()),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete task",
      data: error,
    });
  }

  return {
    success: true,
  };
});
