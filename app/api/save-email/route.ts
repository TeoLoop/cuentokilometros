import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // --- LIMPIEZA DE CLAVE PARA VERCEL ---
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) throw new Error("GOOGLE_PRIVATE_KEY missing");

    // 1. Si la clave tiene comillas extra al principio o final, las quitamos
    privateKey = privateKey.replace(/^"|"$/g, "");

    // 2. Vercel a veces necesita que los "\n" literales se conviertan en saltos reales
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    // -------------------------------------

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
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
      date: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Vercel Error Log:", error); // Esto aparecerá en los logs de Vercel
    return NextResponse.json(
      { error: "Error de servidor", details: error.message },
      { status: 500 }
    );
  }
}