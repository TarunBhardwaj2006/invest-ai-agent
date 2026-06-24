import { NextResponse } from "next/server";
import type { HealthResponse } from "@/types/api";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse<HealthResponse>> {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
  });
}
