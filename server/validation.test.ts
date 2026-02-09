import { describe, expect, test } from "bun:test";
import { validateTemplatePreviewRenderRequest } from "./validation";

describe("template preview validation", () => {
  test("accepts valid preview payload", () => {
    const result = validateTemplatePreviewRenderRequest({
      html: "<div>{{title}}</div>",
      css: ".x{color:red}",
      variables: [{ name: "title", type: "string", defaultValue: "Hello" }],
      variableValues: { title: "World" },
      width: 1200,
      height: 630,
      format: "png",
    });

    expect("code" in result).toBe(false);
  });

  test("rejects invalid format", () => {
    const result = validateTemplatePreviewRenderRequest({
      html: "<div />",
      variables: [],
      width: 1200,
      height: 630,
      format: "gif",
    });

    expect("code" in result && result.code).toBe("INVALID_FORMAT");
  });

  test("rejects invalid dimensions", () => {
    const result = validateTemplatePreviewRenderRequest({
      html: "<div />",
      variables: [],
      width: 0,
      height: 630,
      format: "png",
    });

    expect("code" in result && result.code).toBe("INVALID_WIDTH");
  });
});
