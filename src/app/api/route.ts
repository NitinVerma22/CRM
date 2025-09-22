import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzrrotwi95BFwhbX21BIYKRekzoNuhWa14RbB0-RWbhZLsbnkHuP_kkMgyMr34UxGmm3w/exec';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', action || '');

    console.log('GET to Google Apps Script:', url.toString());
    console.log('Action:', action);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Next.js App)',
      },
    });

    console.log('Google Apps Script response status:', response.status);
    const responseText = await response.text();
    console.log('Google Apps Script response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      data = { raw: responseText, error: 'Invalid JSON response' };
    }

    console.log('Parsed data:', data);

    // Create response with CORS headers
    const nextResponse = NextResponse.json(data);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  } catch (error) {
    console.error('API Error:', error);

    // Create error response with CORS headers
    const errorResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });

    return errorResponse;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    // Build URL with action parameter for Google Apps Script
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    if (action) {
      url.searchParams.append('action', action);
    }

    console.log('POST to Google Apps Script:', url.toString());
    console.log('Action:', action);
    console.log('Body:', JSON.stringify(body, null, 2));

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Next.js App)',
      },
      body: JSON.stringify(body)
    });

    console.log('Google Apps Script response status:', response.status);
    const responseText = await response.text();
    console.log('Google Apps Script response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      data = { raw: responseText, error: 'Invalid JSON response' };
    }

    console.log('Parsed data:', data);

    // Create response with CORS headers
    const nextResponse = NextResponse.json(data);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  } catch (error) {
    console.error('API Error:', error);

    // Create error response with CORS headers
    const errorResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });

    return errorResponse;
  }
}
