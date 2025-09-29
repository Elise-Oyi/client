import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learners/${id}`;
    console.log("Get single learner request to:", apiUrl);
    
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
    console.log("Get single learner response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch learner");
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
    const body = await req.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learners/${id}`;
    
    console.log("Update learner request to:", apiUrl);
    console.log("Request body:", body);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Update learner response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update learner");
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learners/${id}`;
    console.log("Delete learner request to:", apiUrl);
    
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
    console.log("Delete learner response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete learner");
  }
};