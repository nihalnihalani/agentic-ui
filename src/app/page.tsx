import { Header } from "@/components/layout/header";
import { ShaderHero } from "@/components/layout/shader-hero";
import { SmartRegistry } from "@/components/agentic/smart-registry";
import { Footer } from "@/components/layout/footer";
import { CopilotWrapper } from "@/components/layout/copilot-wrapper";

export default function Home() {
  return (
    <CopilotWrapper>
      <div className="flex min-h-screen flex-col">
        <Header transparent />
        <main className="flex-1">
          <div className="-mt-16">
            <ShaderHero />
          </div>
          <SmartRegistry />
        </main>
        <Footer />
      </div>
    </CopilotWrapper>
  );
}
