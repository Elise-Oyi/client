import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl, getAuthToken, createAuthHeaders } from "@/lib/errorHandler";
import { handleFormDataRequest } from "@/lib/formData";

export const GET = async (req: NextRequest) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const token = getAuthToken(req);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch tracks");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const token = getAuthToken(req);
    const formData = await req.formData();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks`;

    const additionalHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await handleFormDataRequest(
      apiUrl,
      Object.fromEntries(formData.entries()),
      'POST',
      additionalHeaders
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create track");
  }
};