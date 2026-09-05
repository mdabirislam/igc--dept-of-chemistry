import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
    message: "Notice API is ready.",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(
    {
      success: true,
      data: {
        ...body,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}