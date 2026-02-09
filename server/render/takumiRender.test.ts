import { describe, expect, test } from "bun:test";
import type { Logger } from "../lib/logger";
import { renderWithTakumi } from "./takumiRender";

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

async function renderHash(html: string): Promise<string> {
  const result = await renderWithTakumi(
    {
      html,
      width: 320,
      height: 180,
      format: "png",
    },
    loggerStub
  );
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(result.buffer);
  return hasher.digest("hex");
}

describe("takumi renderer hardening", () => {
  test("renders className the same as class", async () => {
    const htmlClass =
      '<div class="w-full h-full bg-red-500 flex items-center justify-center"><span class="text-white text-2xl">A</span></div>';
    const htmlClassName =
      '<div className="w-full h-full bg-red-500 flex items-center justify-center"><span className="text-white text-2xl">A</span></div>';

    expect(await renderHash(htmlClassName)).toBe(await renderHash(htmlClass));
  });

  test("supports class aliases (className/classname/CLASS/tw) in one render", async () => {
    const baseline =
      '<div class="w-full h-full bg-zinc-900 flex items-center justify-center"><span class="text-white text-xl">OK</span></div>';
    const aliased =
      '<div className="w-full h-full" classname="bg-zinc-900" CLASS="flex items-center" tw="justify-center"><span className="text-white text-xl">OK</span></div>';

    expect(await renderHash(aliased)).toBe(await renderHash(baseline));
  });

  test("drops unsupported CSS var() usage instead of failing render", async () => {
    const stable = '<div style="width:100%;height:100%"></div>';
    const withCssVars = '<div style="--bg:#ff0000;background:var(--bg);width:100%;height:100%"></div>';

    expect(await renderHash(withCssVars)).toBe(await renderHash(stable));
  });

  test("drops unsupported overflow values instead of throwing", async () => {
    const result = await renderWithTakumi(
      {
        html: '<div style="width:100%;height:100%;overflow-y:scroll;background:#00ff00"></div>',
        width: 200,
        height: 120,
        format: "png",
      },
      loggerStub
    );

    expect(result.buffer.length).toBeGreaterThan(0);
  });

  test("normalizes unsupported display variants used by playground cards", async () => {
    const result = await renderWithTakumi(
      {
        html: '<div style="display:inline-block;width:fit-content;padding:5px 12px;border:1px solid rgba(255,77,0,0.15)">POST /render</div>',
        width: 400,
        height: 120,
        format: "png",
      },
      loggerStub
    );

    expect(result.buffer.length).toBeGreaterThan(0);
  });

  test("drops data-url background images instead of failing resource fetch", async () => {
    const withDataUrl =
      '<div style="width:100%;height:100%;background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;10&quot; height=&quot;10&quot;></svg>\')"></div>';

    const result = await renderWithTakumi(
      {
        html: withDataUrl,
        width: 200,
        height: 120,
        format: "png",
      },
      loggerStub
    );

    expect(result.buffer.length).toBeGreaterThan(0);
  });
});
