export type TemplateVariable = {
  name: string;
  type: "string" | "number" | "url";
  defaultValue?: string;
};

export type TemplateFormat = "png" | "jpeg" | "webp";
