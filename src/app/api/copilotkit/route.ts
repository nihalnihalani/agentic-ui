import {
  CopilotRuntime,
  OpenAIAdapter,
  AnthropicAdapter,
  GroqAdapter,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

export const POST = async (req: Request) => {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;

    if (!openaiKey && !anthropicKey && !groqKey && !googleKey) {
      return new Response(
        JSON.stringify({
          error:
            "No API key configured. Add OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, or GOOGLE_API_KEY to .env.local",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const runtime = new CopilotRuntime();

    let serviceAdapter;
    if (openaiKey) {
      serviceAdapter = new OpenAIAdapter();
    } else if (anthropicKey) {
      serviceAdapter = new AnthropicAdapter();
    } else if (groqKey) {
      serviceAdapter = new GroqAdapter();
    } else if (googleKey) {
      serviceAdapter = new GoogleGenerativeAIAdapter({ apiKey: googleKey });
    } else {
      serviceAdapter = new OpenAIAdapter();
    }

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    return handleRequest(req);
  } catch (error) {
    console.error("[CopilotKit API Error]", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const GET = async () => {
  const adapters = [];
  if (process.env.OPENAI_API_KEY) adapters.push("openai");
  if (process.env.ANTHROPIC_API_KEY) adapters.push("anthropic");
  if (process.env.GROQ_API_KEY) adapters.push("groq");
  if (process.env.GOOGLE_API_KEY) adapters.push("google");

  return new Response(
    JSON.stringify({
      status: adapters.length > 0 ? "ok" : "unconfigured",
      adapters,
      version: "1.0.0",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
