//src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Basic validation
    if (!data?.name || !data?.phone) {
      return NextResponse.json({ message: "Missing name or phone" }, { status: 400 });
    }

    // TODO: integrate SendGrid / Supabase / email or DB storage here.
    // Example: await sendEmailToSupport(data);

    // For now, just log to server console (visible in your terminal)
    console.log("Lead received:", data);

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
