import { describe, expect, test } from "bun:test";
import { interpolateTemplate, resolveTemplateVariables } from "./templateInterpolation";

describe("template interpolation", () => {
  test("interpolates html and css placeholders", () => {
    const template = {
      html: "<div>{{title}}</div>",
      css: ".card { color: {{color}}; }",
      variables: [
        { name: "title" },
        { name: "color", defaultValue: "red" },
      ],
    };
    const resolved = resolveTemplateVariables(template, { title: "Hello" });

    expect(resolved.missing).toEqual([]);
    expect(interpolateTemplate(template, resolved.values)).toBe(
      "<style>.card { color: red; }</style>\n<div>Hello</div>"
    );
  });

  test("reports missing required variables", () => {
    const template = {
      html: "<div>{{title}}</div>",
      variables: [{ name: "title" }],
    };

    const resolved = resolveTemplateVariables(template, {});
    expect(resolved.values).toEqual({});
    expect(resolved.missing).toEqual(["title"]);
  });
});
