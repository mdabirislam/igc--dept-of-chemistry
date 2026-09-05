import { NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: Context
) {
  const { id } = await context.params;

  return NextResponse.json({
    success: true,
    data: {
      id,
      title: "Demo Notice",
    },
  });
}

export async function DELETE(
  _request: Request,
  context: Context
) {
  const { id } = await context.params;

  return NextResponse.json({
    success: true,
    deleted: id,
  });
}