import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";
import { handleFormDataRequest, extractFormData } from "@/lib/formData";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`;
    
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

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch course");
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const formData = await extractFormData(req);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`;
    

    const response = await handleFormDataRequest(apiUrl, formData, 'PUT');
    

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update course");
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`;
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete course");
  }
};