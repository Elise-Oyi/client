import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({ message: "API routes are working!" });
};