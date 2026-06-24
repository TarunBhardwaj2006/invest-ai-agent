import { runResearchWithProgress } from "@/lib/services/research-service";
import { parseResearchRequest } from "@/lib/utils/validation";
import { isAppError, toAppError } from "@/lib/utils/errors";
import type { ResearchStreamEvent } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 120;

function encodeEvent(event: ResearchStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request): Promise<Response> {
  let companyName: string;

  try {
    const body: unknown = await request.json();
    ({ companyName } = parseResearchRequest(body));
  } catch (error) {
    const appError = toAppError(error);
    const event: ResearchStreamEvent = {
      type: "error",
      payload: { message: appError.message },
    };

    return new Response(encodeEvent(event), {
      status: isAppError(error) ? appError.statusCode : 500,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (event: ResearchStreamEvent) => {
        controller.enqueue(encoder.encode(encodeEvent(event)));
      };

      try {
        const result = await runResearchWithProgress(companyName, (progress) => {
          send({ type: "progress", payload: progress });
        });

        send({ type: "complete", payload: result });
      } catch (error) {
        const appError = toAppError(error);
        send({ type: "error", payload: { message: appError.message } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
