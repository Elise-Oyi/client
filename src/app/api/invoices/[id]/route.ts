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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices/${id}`;
    console.log("Get single invoice request to:", apiUrl);
    
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
    console.log("Get single invoice response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch invoice");
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices/${id}`;
    
    console.log("Update invoice request to:", apiUrl);
    console.log("Request body:", body);

    const response = await axios.put(
      apiUrl,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("Update invoice response data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update invoice");
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices/${id}`;
    console.log("Delete invoice request to:", apiUrl);
    
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
    console.log("Delete invoice response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete invoice");
  }
};