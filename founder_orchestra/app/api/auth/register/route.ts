import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(
    { error: "Registration is disabled. Only pre-configured administrator login is permitted." },
    { status: 403 }
  );
}
