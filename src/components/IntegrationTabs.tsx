"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  label: string;
  language: string;
  filename: string;
  snippet: string;
}

export function IntegrationTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <Tabs defaultValue={tabs[0]?.label} className="w-full">
      <TabsList className="h-auto gap-0 rounded-none border-2 border-[#1a1a1a]/20 bg-[#f5f0e8] p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.label}
            value={tab.label}
            className="rounded-none px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#f5f0e8] data-[state=active]:shadow-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label} className="mt-0">
          <div className="border-2 border-t-0 border-[#1a1a1a]/20 bg-[#0a0a0a] shadow-[4px_4px_0_0_rgba(26,26,26,0.08)]">
            <div className="flex items-center justify-between border-b border-[#f5f0e8]/10 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="h-4 w-px bg-[#f5f0e8]/10" />
                <span className="text-[11px] text-[#f5f0e8]/40">
                  {tab.filename}
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-[#f5f0e8]/20 uppercase">
                {tab.language}
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-[12px] leading-[1.9] text-[#a5d6a7] md:p-6 md:text-[13px]">
              <code>{tab.snippet}</code>
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
