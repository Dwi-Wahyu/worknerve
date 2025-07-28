import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  return await prisma.task.findFirst({
    where: {
      id: parseInt(id?.toString() as string),
    },
  });
});
