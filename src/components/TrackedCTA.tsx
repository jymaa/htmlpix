"use client";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import type { ComponentProps } from "react";

export function TrackedCTA({
  href,
  eventName,
  eventProps,
  children,
  ...rest
}: {
  href: string;
  eventName: string;
  eventProps?: Record<string, string | number | boolean>;
} & Omit<ComponentProps<typeof Link>, "href">) {
  const plausible = usePlausible();
  return (
    <Link
      href={href}
      onClick={() => plausible(eventName, { props: eventProps })}
      {...rest}
    >
      {children}
    </Link>
  );
}
