import { getCollection, type CollectionEntry } from 'astro:content';

export type NoteKind = 'course' | 'paper' | 'project';

export function kindLabel(kind: NoteKind): string {
  switch (kind) {
    case 'course':
      return 'Note';
    case 'paper':
      return 'Paper';
    case 'project':
      return 'Project';
  }
}

export interface NoteViewModel {
  id: string;
  title: string;
  summary: string;
  date: Date;
  kind: NoteKind;
  tags: string[];
  featured: boolean;
  link?: string;
  url: string;
}

const toViewModel = (note: CollectionEntry<'notes'>): NoteViewModel => ({
  id: note.id,
  title: note.data.title,
  summary: note.data.summary,
  date: note.data.date,
  kind: note.data.kind,
  tags: note.data.tags,
  featured: note.data.featured,
  link: note.data.link,
  url: `/notes/${note.id}/`
});

export async function getNotes(kind?: NoteKind): Promise<NoteViewModel[]> {
  const notes = await getCollection('notes', (entry) => (kind ? entry.data.kind === kind : true));

  return notes
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map(toViewModel);
}

/** Rough reading time from summary length (no full body scan). */
export function estimateReadMinutes(summary: string): number {
  const chars = summary.replace(/\s+/g, ' ').trim().length;
  const minutes = Math.ceil(chars / 420);
  return Math.max(1, Math.min(60, minutes));
}

export interface NotesYearGroup {
  year: number;
  items: NoteViewModel[];
}

export async function getNotesByYear(): Promise<NotesYearGroup[]> {
  const notes = await getNotes();
  const byYear = new Map<number, NoteViewModel[]>();

  for (const note of notes) {
    const year = note.date.getFullYear();
    const bucket = byYear.get(year);
    if (bucket) {
      bucket.push(note);
    } else {
      byYear.set(year, [note]);
    }
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}
