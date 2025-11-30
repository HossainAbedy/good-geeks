// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/reviews — fetch latest reviews
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Fetch reviews error:", error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error fetching reviews:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/reviews — create a new review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rating, text = "", suburb = "" } = body;

    // Basic validation
    if (!name || !rating || isNaN(Number(rating))) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const newReview = {
      name,
      rating: Number(rating),
      text,
      suburb,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert([newReview])
      .select()
      .single();

    if (error) {
      console.error("Insert review error:", error);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error creating review:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
