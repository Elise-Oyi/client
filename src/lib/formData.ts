import axios from "axios";

export async function handleFormDataRequest(
  url: string,
  data: Record<string, any>,
  method: 'POST' | 'PUT' = 'POST',
  additionalHeaders: Record<string, string> = {}
) {
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const headers = {
    'Content-Type': 'multipart/form-data',
    ...additionalHeaders
  };

  return axios({
    method,
    url,
    data: formData,
    headers,
  });
}

export function extractFormData(request: Request): Promise<Record<string, any>> {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = await request.formData();
      const data: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}