import { getCurrentRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const role = await getCurrentRole();

  if (role !== Role.ADMIN) {
    return NextResponse.json(
      { message: "Forbidden API Route!" },
      { status: 403 }
    );
  }

  return NextResponse.json({ message: "Allowed API Route!" }, { status: 200 });
}
