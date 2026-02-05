import { PublicHeader } from "@/components/PublicHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex gap-8">
          <DocsSidebar />
          <main className="flex-1 min-w-0 max-w-3xl">
            <article>{children}</article>
          </main>
          <DocsToc />
        </div>
      </div>
    </div>
  );
}
