import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "check-re-engagement",
  { hourUTC: 10, minuteUTC: 0 },
  internal.emailCrons.checkReEngagement,
);

export default crons;
