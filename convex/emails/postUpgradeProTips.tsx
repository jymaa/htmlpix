import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface PostUpgradeProTipsEmailProps {
  name: string;
  plan: string;
  unsubscribeUrl?: string;
}

export default function PostUpgradeProTipsEmail({
  name,
  plan,
  unsubscribeUrl,
}: PostUpgradeProTipsEmailProps) {
  return (
    <BaseEmail
      previewText={`Get the most out of your ${plan} plan`}
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="product_updates"
    >
      <Heading style={styles.h1}>Pro tips for your {plan} plan</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        Now that you&apos;re on {plan}, here are a few ways to get more value:
      </Text>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>Batch rendering</Text>
      <Text style={styles.text}>
        Need to generate many images at once? Fire requests in parallel — your higher limit means
        you won&apos;t hit throttling as quickly.
      </Text>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>Templates</Text>
      <Text style={styles.text}>
        Save your HTML layouts as templates in the dashboard, then render them with different
        variables via the API. Great for social cards, certificates, or invoices.
      </Text>

      <Section style={styles.code}>
        <Text style={{ margin: 0, fontFamily: "monospace", fontSize: "13px" }}>
          POST /v1/image-url{"\n"}
          {"{"}{"\n"}
          {"  "}&quot;templateId&quot;: &quot;your-template-id&quot;,{"\n"}
          {"  "}&quot;variables&quot;: {"{"} &quot;title&quot;: &quot;My Post&quot; {"}"}{"\n"}
          {"}"}
        </Text>
      </Section>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>Signed OG URLs</Text>
      <Text style={styles.text}>
        Each mint returns a signed URL you can put directly in og:image tags. URLs are long-lived and
        cache-friendly for crawlers.
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/docs" style={{ ...styles.link, color: "#898989" }}>
          Full documentation
        </Link>
      </Text>
    </BaseEmail>
  );
}
