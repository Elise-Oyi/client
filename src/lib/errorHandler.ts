import { NextRequest, NextResponse } from "next/server";

export function handleApiError(error: any, defaultMessage: string = "Request failed") {
  console.error("API error:", error.response?.data || error.message);
  
  let message = defaultMessage;
  let status = 500;
  
  if (error?.response?.data) {
    const errorData = error.response.data;
    status = error.response.status || 500;
    
    // Handle Azure API error format: { success: false, errors: [{ message: "..." }] }
    if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      message = errorData.errors[0].message;
    }
    // Handle other possible error formats
    else if (errorData.message) {
      message = errorData.message;
    }
    // Handle direct error string
    else if (typeof errorData === 'string') {
      message = errorData;
    }
    
    // Handle JWT expired errors
    if (message.toLowerCase().includes('jwt expired') || message.toLowerCase().includes('token expired')) {
      status = 401;
      message = "Your session has expired. Please log in again.";
    }
  } else if (error.message) {
    message = error.message;
    
    // Handle JWT expired errors in error message
    if (message.toLowerCase().includes('jwt expired') || message.toLowerCase().includes('token expired')) {
      status = 401;
      message = "Your session has expired. Please log in again.";
    }
  }
  
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export function checkBackendUrl() {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
    return NextResponse.json(
      { error: "Backend URL not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env.local file" },
      { status: 500 }
    );
  }
  return null;
}

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function createAuthHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}