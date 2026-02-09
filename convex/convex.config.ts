import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";
import resend from "@convex-dev/resend/convex.config";
import aggregate from "@convex-dev/aggregate/convex.config";
import stripe from "@convex-dev/stripe/convex.config.js";
import workflow from "@convex-dev/workflow/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(resend);
app.use(aggregate);
app.use(stripe);
app.use(workflow);

export default app;
