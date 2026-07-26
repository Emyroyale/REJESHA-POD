import { NextResponse } from "next/server";
import { getPersonalizationConfig } from "@/lib/personalization-config";
import { uploadPrintifyImage } from "@/lib/printify";
import { getSupabaseAdmin, type PersonalizationRecord } from "@/lib/supabase";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPngDimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  // IHDR is always the first chunk: 4-byte length, 4-byte type "IHDR",
  // then 4-byte width + 4-byte height (both big-endian).
  const chunkType = buf.toString("ascii", 12, 16);
  if (chunkType !== "IHDR") return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const configuration = formData.get("configuration");
  const design = formData.get("design");

  if (typeof productId !== "string" || typeof configuration !== "string") {
    return NextResponse.json({ error: "Missing productId or configuration" }, { status: 400 });
  }
  if (!(design instanceof Blob)) {
    return NextResponse.json({ error: "Missing design file" }, { status: 400 });
  }

  const config = getPersonalizationConfig(productId);
  if (!config) {
    return NextResponse.json({ error: "Product does not support personalization" }, { status: 400 });
  }

  if (design.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Design file too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await design.arrayBuffer());
  const dimensions = readPngDimensions(buffer);
  if (!dimensions) {
    return NextResponse.json({ error: "File is not a valid PNG" }, { status: 400 });
  }
  if (dimensions.width !== config.output.width || dimensions.height !== config.output.height) {
    return NextResponse.json(
      {
        error: `Design must be exactly ${config.output.width}x${config.output.height}px, got ${dimensions.width}x${dimensions.height}`,
      },
      { status: 400 }
    );
  }

  let parsedConfiguration: unknown;
  try {
    parsedConfiguration = JSON.parse(configuration);
  } catch {
    return NextResponse.json({ error: "Invalid configuration JSON" }, { status: 400 });
  }

  const upload = await uploadPrintifyImage(
    `personalization-${productId}-${Date.now()}.png`,
    buffer.toString("base64")
  );

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("personalizations")
    .insert({
      product_id: productId,
      printify_upload_id: upload.id,
      preview_url: upload.preview_url,
      configuration: parsedConfiguration,
      status: "draft",
    })
    .select("id")
    .single<Pick<PersonalizationRecord, "id">>();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to save personalization" }, { status: 500 });
  }

  return NextResponse.json({ personalizationId: data.id, previewUrl: upload.preview_url });
}
