import { PublicHeader } from "@/components/PublicHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <PublicHeader />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex gap-8">
          <DocsSidebar />
          <main className="max-w-3xl min-w-0 flex-1">
            <article>{children}</article>
          </main>
          <DocsToc />
        </div>
      </div>
    </div>
  );
}
