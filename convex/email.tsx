import "./polyfills";
import MagicLinkEmail from "./emails/magicLink";
import { render } from "@react-email/components";
import React from "react";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import { ActionCtx } from "./_generated/server";

const sendEmail = async (
  ctx: ActionCtx,
  {
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }
) => {
  const resend = new Resend(components.resend, {
    testMode: false,
  });
  await resend.sendEmail(ctx, {
    from: "No-reply <no-reply@htmlpix.com>",
    to,
    subject,
    html,
  });
};

export const sendMagicLink = async (
  ctx: ActionCtx,
  {
    to,
    url,
  }: {
    to: string;
    url: string;
  }
) => {
  await sendEmail(ctx, {
    to,
    subject: "Connexion à votre compte",
    html: await render(<MagicLinkEmail url={url} brandName="HTMLPix" brandTagline="HTMLPix" />),
  });
};
