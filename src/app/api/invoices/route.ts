import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices`;
    console.log("Get invoices request to:", apiUrl);
    
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
    console.log("Get invoices response data:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch invoices");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const urlCheck = checkBackendUrl();
    if (urlCheck) return urlCheck;

    const body = await req.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices`;
    
    console.log("Create invoice request to:", apiUrl);
    console.log("Request body:", body);

    const response = await axios.post(
      apiUrl,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("Create invoice response data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create invoice");
  }
};