import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";

export const POST = async (req: NextRequest) => {
  try {
    // Check if backend URL is configured
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const body = await req.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup/admin`;
    console.log("Signup request to:", apiUrl);

    const response = await axios.post(
      apiUrl,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Signup response data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    return handleApiError(error, "Signup failed");
  }
}
