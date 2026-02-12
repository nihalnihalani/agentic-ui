import { Header } from "@/components/layout/header";
import { ShaderHero } from "@/components/layout/shader-hero";
import { SmartRegistry } from "@/components/agentic/smart-registry";
import { Footer } from "@/components/layout/footer";
import { CopilotProvider } from "@/components/layout/copilot-provider";
import { CopilotDiscovery } from "@/components/layout/copilot-discovery";

export default function Home() {
  return (
    <CopilotProvider>
      <CopilotDiscovery />
      <div className="flex min-h-screen flex-col">
        <Header transparent />
        <main className="flex-1 pt-16">
          <ShaderHero />
          <SmartRegistry />
        </main>
        <Footer />
      </div>
    </CopilotProvider>
  );
}
