import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface WelcomeEmailProps {
  name: string;
  unsubscribeUrl?: string;
}

export default function WelcomeEmail({ name, unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <BaseEmail
      previewText="Welcome to HTMLPix — your API key is ready"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="transactional"
    >
      <Heading style={styles.h1}>Welcome to HTMLPix</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        Your account is set up and your API key is ready. You can start converting HTML to pixel-perfect
        images right away.
      </Text>

      <Section style={styles.code}>
        <Text style={{ margin: 0, fontFamily: "monospace", fontSize: "13px" }}>
          curl -X POST https://api.htmlpix.com/render \{"\n"}
          {"  "}-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \{"\n"}
          {"  "}-H &quot;Content-Type: application/json&quot; \{"\n"}
          {"  "}-d &apos;{"{"}&quot;html&quot;: &quot;&lt;h1&gt;Hello&lt;/h1&gt;&quot;{"}"}&apos;
        </Text>
      </Section>

      <Text style={styles.text}>Quick links to get started:</Text>
      <Text style={styles.text}>
        <Link href="https://htmlpix.com/docs/quickstart" style={styles.link}>
          Quickstart Guide
        </Link>
        {" • "}
        <Link href="https://htmlpix.com/docs/endpoints" style={styles.link}>
          API Reference
        </Link>
        {" • "}
        <Link href="https://htmlpix.com/docs/examples" style={styles.link}>
          Examples
        </Link>
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989", fontSize: "13px" }}>
        You&apos;re on the free plan with 50 renders/month. Need more?{" "}
        <Link href="https://htmlpix.com/pricing" style={{ ...styles.link, fontSize: "13px" }}>
          Check out our plans
        </Link>
        .
      </Text>
    </BaseEmail>
  );
}
