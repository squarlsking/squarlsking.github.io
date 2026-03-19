import { getCollection, type CollectionEntry } from 'astro:content';

export type NoteKind = 'course' | 'paper' | 'project';

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
