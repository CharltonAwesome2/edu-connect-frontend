export const isPending = (b) => b.status === "PENDING";
export const isApproved = (b) => b.status === "APPROVED" || b.status === "ACCEPTED";

export const normaliseStatus = (uiStatus) =>
  uiStatus === "ACCEPTED" || uiStatus === "APPROVED" ? "APPROVED" : "DECLINED";