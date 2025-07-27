import type { Status, Urgency } from "~/schema/task";

export const formatUrgency = (urgency: Urgency) => {
  switch (urgency) {
    case "CRITICAL":
      return "Kritis";
    case "HIGH":
      return "Tinggi";
    case "MEDIUM":
      return "Sedang";
    case "LOW":
      return "Rendah";
    default:
      return urgency;
  }
};

export const getUrgencyColorClass = (urgency: Urgency) => {
  switch (urgency) {
    case "CRITICAL":
      return "text-red-600 dark:text-red-400";
    case "HIGH":
      return "text-orange-600 dark:text-orange-400";
    case "MEDIUM":
      return "text-yellow-600 dark:text-yellow-400";
    case "LOW":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-800 dark:text-gray-200";
  }
};

export const getUrgencyColorBadge = (urgency: Urgency) => {
  switch (urgency) {
    case "CRITICAL":
      return "error";
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "primary";
    case "LOW":
      return "success";
    default:
      return "info";
  }
};

export const getStatusColorBadge = (status: Status) => {
  switch (status) {
    case "PENDING":
      return "primary";
    case "BLOCKED":
      return "warning";
    case "CANCELLED":
      return "error";
    case "COMPLETED":
      return "success";
    default:
      return "info";
  }
};
