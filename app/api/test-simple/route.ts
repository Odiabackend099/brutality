import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Simple API endpoint working',
    timestamp: new Date().toISOString(),
    method: 'GET'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Simple API endpoint working',
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedData: body
    })
  } catch (error) {
    console.error('Simple API POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON in request body'
    }, { status: 400 })
  }
}
