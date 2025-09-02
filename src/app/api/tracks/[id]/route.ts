import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl, getAuthToken, createAuthHeaders } from "@/lib/errorHandler";
import { handleFormDataRequest } from "@/lib/formData";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const token = getAuthToken(req);
    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks/${id}`;
    console.log("Get single track request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Get single track response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch track");
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const token = getAuthToken(req);
    const { id } = await params;
    const formData = await req.formData();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks/${id}`;
    
    console.log("Update track request to:", apiUrl);

    const additionalHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await handleFormDataRequest(
      apiUrl,
      Object.fromEntries(formData.entries()),
      'PUT',
      additionalHeaders
    );
    
    console.log("Update track response data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update track");
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const token = getAuthToken(req);
    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tracks/${id}`;
    console.log("Delete track request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: createAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Delete track response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete track");
  }
};