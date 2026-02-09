import { describe, expect, test } from "bun:test";
import { validateTemplatePreviewRenderRequest } from "./validation";

describe("template preview validation", () => {
  test("accepts valid preview payload", () => {
    const result = validateTemplatePreviewRenderRequest({
      jsx: 'const { title } = props;\nreturn <div>{title}</div>;',
      variables: [{ name: "title", type: "string", defaultValue: "Hello" }],
      variableValues: { title: "World" },
      width: 1200,
      height: 630,
      format: "png",
    });

    expect("code" in result).toBe(false);
  });

  test("accepts variables without an explicit type", () => {
    const result = validateTemplatePreviewRenderRequest({
      jsx: 'const { title } = props;\nreturn <div>{title}</div>;',
      variables: [{ name: "title", defaultValue: "Hello" }],
      width: 1200,
      height: 630,
      format: "png",
    });

    expect("code" in result).toBe(false);
  });

  test("accepts googleFonts array", () => {
    const result = validateTemplatePreviewRenderRequest({
      jsx: 'return <div style={{fontFamily: "Inter"}}>Hello</div>;',
      variables: [],
      googleFonts: ["Inter:wght@400;700"],
      width: 1200,
      height: 630,
      format: "png",
    });

    expect("code" in result).toBe(false);
    if (!("code" in result)) {
      expect(result.googleFonts).toEqual(["Inter:wght@400;700"]);
    }
  });

  test("rejects invalid format", () => {
    const result = validateTemplatePreviewRenderRequest({
      jsx: 'return <div />;',
      variables: [],
      width: 1200,
      height: 630,
      format: "gif",
    });

    expect("code" in result && result.code).toBe("INVALID_FORMAT");
  });

  test("rejects invalid dimensions", () => {
    const result = validateTemplatePreviewRenderRequest({
      jsx: 'return <div />;',
      variables: [],
      width: 0,
      height: 630,
      format: "png",
    });

    expect("code" in result && result.code).toBe("INVALID_WIDTH");
  });

  test("rejects missing jsx", () => {
    const result = validateTemplatePreviewRenderRequest({
      variables: [],
      width: 1200,
      height: 630,
      format: "png",
    });

    expect("code" in result && result.code).toBe("MISSING_JSX");
  });
});
