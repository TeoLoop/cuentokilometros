import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID!,
      serviceAccountAuth
    );

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      email,
      date: new Date(new Date().getTime() - 3 * 60 * 60 * 1000)
        .toISOString()
        .replace("Z", ""), // Manual UTC-3 for Uruguay
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in save-email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save email" },
      { status: 500 }
    );
  }
}
