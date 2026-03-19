import { getNotes } from '../lib/notes';

export const prerender = true;

export async function GET() {
  const notes = await getNotes();

  const payload = notes.map((note) => ({
    id: note.id,
    title: note.title,
    summary: note.summary,
    date: note.date.toISOString(),
    kind: note.kind,
    tags: note.tags,
    featured: note.featured,
    link: note.link ?? null,
    url: note.url
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
