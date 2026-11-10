import { readGitHubContributions } from "../scripts/read-github-contributions.mjs";

export default {
  async fetch(request) {
    if (request.method !== "GET") return new Response(null, { status: 405, headers: { Allow: "GET" } });
    try {
      return Response.json(await readGitHubContributions(), {
        headers: { "Cache-Control": "public, max-age=120, s-maxage=21600, stale-while-revalidate=86400" },
      });
    } catch {
      return Response.json({ error: "GitHub contributions are temporarily unavailable." }, { status: 503 });
    }
  },
};
