import { H3Event, type EventHandlerRequest } from "h3";

export function getUserIdFromQuery(event: H3Event<EventHandlerRequest>) {
  const query = getQuery(event);

  const userIdFromQuery = query.userId;

  if (typeof userIdFromQuery === "undefined" || userIdFromQuery === null) {
    throw createError({
      statusCode: 400,
      message: "Parameter userId diperlukan.",
    });
  }

  return userIdFromQuery;
}
