import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";
import axios from "axios";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks/${id}/ratings`;
    console.log("Get track ratings request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Get track ratings response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch track ratings");
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const body = await req.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks/${id}/ratings`;
    
    console.log("Rate track request to:", apiUrl);
    console.log("Rating data:", body);

    const response = await axios.post(
      apiUrl,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("Rate track response data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to rate track");
  }
};