import { NextResponse } from "next/server";
import { runResearch } from "@/lib/services/research-service";
import { parseResearchRequest } from "@/lib/utils/validation";
import { isAppError, toAppError } from "@/lib/utils/errors";
import type { ResearchApiResponse } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request): Promise<NextResponse<ResearchApiResponse>> {
  try {
    const body: unknown = await request.json();
    const { companyName } = parseResearchRequest(body);
    const data = await runResearch(companyName);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const appError = toAppError(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
        },
      },
      { status: isAppError(error) ? appError.statusCode : 500 },
    );
  }
}
