export async function GET(request) {
  // Project Log download has been disabled.
  return new Response("Not Found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}
