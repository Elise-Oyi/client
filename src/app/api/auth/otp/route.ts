import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, checkBackendUrl } from "@/lib/errorHandler";

export const POST = async (req: NextRequest) => {
    try {
        // Check if backend URL is configured
        const urlCheck = checkBackendUrl();
        if (urlCheck) return urlCheck;

        const body = await req.json()
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email`
        
        // Get Authorization header from the request
        const authHeader = req.headers.get('authorization')

        const response = await axios.post(
            apiUrl,
            body,
            {
                headers: { 
                    "Content-Type": "application/json",
                    ...(authHeader && { "Authorization": authHeader })
                },
            }
        )
        return NextResponse.json(response.data)
    } catch (error: any) {
        return handleApiError(error, "OTP verification failed");
    }
}