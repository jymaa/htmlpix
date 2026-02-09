"use client";

import { useParams } from "next/navigation";
import { TemplateEditorShell } from "@/components/templates/TemplateEditorShell";

export default function TemplateEditorPage() {
  const params = useParams();
  return <TemplateEditorShell templateId={String(params.id)} />;
}
