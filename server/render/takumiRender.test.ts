import { describe, expect, test } from "bun:test";
import type { Logger } from "../lib/logger";
import { renderJsxTemplate } from "./takumiRender";

const loggerStub: Logger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
  async flush() {},
  child() {
    return loggerStub;
  },
};

describe("JSX template rendering", () => {
  test("renders a simple JSX template", async () => {
    const result = await renderJsxTemplate(
      {
        jsx: `const { title } = props;\nreturn <div style={{display: "flex", width: "100%", height: "100%", backgroundColor: "#000", color: "#fff", alignItems: "center", justifyContent: "center"}}><h1 style={{fontSize: "48px"}}>{title}</h1></div>;`,
        props: { title: "Hello World" },
        width: 320,
        height: 180,
        format: "png",
      },
      loggerStub
    );

    expect(result.buffer.length).toBeGreaterThan(0);
    expect(result.contentType).toBe("image/png");
    expect(result.renderMs).toBeGreaterThanOrEqual(0);
  });

  test("renders with multiple props", async () => {
    const result = await renderJsxTemplate(
      {
        jsx: `const { title, subtitle } = props;\nreturn (\n  <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#1a1a1a", padding: "40px"}}>\n    <h1 style={{fontSize: "36px", color: "#fff", margin: 0}}>{title}</h1>\n    <p style={{fontSize: "18px", color: "#888", marginTop: "8px"}}>{subtitle}</p>\n  </div>\n);`,
        props: { title: "Test Title", subtitle: "Test Subtitle" },
        width: 400,
        height: 200,
        format: "png",
      },
      loggerStub
    );

    expect(result.buffer.length).toBeGreaterThan(0);
  });

  test("renders different formats", async () => {
    const jsx = `return <div style={{display: "flex", width: "100%", height: "100%", backgroundColor: "#ff0000"}}></div>;`;

    const png = await renderJsxTemplate({ jsx, props: {}, width: 100, height: 100, format: "png" }, loggerStub);
    expect(png.contentType).toBe("image/png");

    const jpeg = await renderJsxTemplate({ jsx, props: {}, width: 100, height: 100, format: "jpeg" }, loggerStub);
    expect(jpeg.contentType).toBe("image/jpeg");
  });

  test("throws on invalid JSX", async () => {
    await expect(
      renderJsxTemplate(
        {
          jsx: `return <div invalid>>>`,
          props: {},
          width: 100,
          height: 100,
          format: "png",
        },
        loggerStub
      )
    ).rejects.toThrow();
  });
});
