import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface QuickStartTipsEmailProps {
  name: string;
  unsubscribeUrl?: string;
}

export default function QuickStartTipsEmail({ name, unsubscribeUrl }: QuickStartTipsEmailProps) {
  return (
    <BaseEmail
      previewText="3 things most devs miss in HTMLPix"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="marketing"
    >
      <Heading style={styles.h1}>3 things most devs miss</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        After watching hundreds of integrations, here are the tricks that save the most time:
      </Text>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>1. Use CSS injection instead of inline styles</Text>
      <Text style={styles.text}>
        Pass a separate <code style={styles.code}>css</code> field instead of cramming styles into your HTML.
        It&apos;s cleaner and renders faster.
      </Text>

      <Section style={styles.code}>
        <Text style={{ margin: 0, fontFamily: "monospace", fontSize: "13px" }}>
          {"{"}{"\n"}
          {"  "}&quot;html&quot;: &quot;&lt;div class=&apos;card&apos;&gt;...&lt;/div&gt;&quot;,{"\n"}
          {"  "}&quot;css&quot;: &quot;.card {"{"} border-radius: 12px; ... {"}"}&quot;{"\n"}
          {"}"}
        </Text>
      </Section>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>2. Content-hash caching is automatic</Text>
      <Text style={styles.text}>
        Identical HTML+CSS combos return cached results instantly. No extra config needed — just
        send the same payload and skip the render cost.
      </Text>

      <Text style={{ ...styles.text, fontWeight: "bold" }}>3. Set viewport for consistent output</Text>
      <Text style={styles.text}>
        Always pass <code style={styles.code}>width</code> and <code style={styles.code}>height</code> to
        avoid browser default surprises. Most social cards work best at 1200x630.
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        Full docs:{" "}
        <Link href="https://htmlpix.com/docs" style={{ ...styles.link, color: "#898989" }}>
          htmlpix.com/docs
        </Link>
      </Text>
    </BaseEmail>
  );
}
