import { supabaseAdmin } from './supabase-server';

type JSONValue = any;
const ROW_ID = 1;

export async function getPortfolioData(): Promise<JSONValue> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('portfolio').select('data').eq('id', ROW_ID).single();
  if (error) throw new Error(`getPortfolioData failed: ${error.message}`);
  return data?.data ?? {};
}

export async function setPortfolioData(next: JSONValue) {
  const sb = supabaseAdmin();
  const { error } = await sb.from('portfolio').update({ data: next }).eq('id', ROW_ID);
  if (error) throw new Error(`setPortfolioData failed: ${error.message}`);
}

export async function getSection<T = any>(section: string): Promise<T> {
  const all = await getPortfolioData();
  return (all?.[section] ?? null) as T;
}

export async function updateSection(section: string, payload: JSONValue) {
  const all = await getPortfolioData();
  const next = { ...(all ?? {}), [section]: payload };
  await setPortfolioData(next);
  return { success: true };
}

/* Array helpers */
function ensureId<T extends Record<string, any>>(item: T): T & { id: string } {
  const makeId =
    (globalThis.crypto as any)?.randomUUID?.bind(globalThis.crypto) ??
    (() => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
  const id = item.id || makeId();
  return { ...item, id };
}

export async function pushItem(section: string, item: any, idField = 'id') {
  const list = (await getSection<any[]>(section)) ?? [];
  const withId = ensureId(item);
  const next = [...list, withId];
  await updateSection(section, next);
  return withId;
}

export async function upsertItem(section: string, item: any, idField = 'id') {
  const list = (await getSection<any[]>(section)) ?? [];
  const withId = ensureId(item);
  const idx = list.findIndex((x) => String(x[idField]) === String(withId[idField]));
  const next = idx === -1 ? [...list, withId] : list.map((x, i) => (i === idx ? { ...x, ...withId } : x));
  await updateSection(section, next);
  return withId;
}

export async function upsertItems(section: string, items: any[], idField = 'id') {
  const list = (await getSection<any[]>(section)) ?? [];
  const byId = new Map<string, any>(list.map((x) => [String(x[idField]), x]));
  for (const raw of items) {
    const it = ensureId(raw);
    const k = String(it[idField]);
    byId.set(k, { ...(byId.get(k) ?? {}), ...it });
  }
  const next = Array.from(byId.values());
  await updateSection(section, next);
  return next;
}

export async function deleteItem(section: string, id: string, idField = 'id') {
  const list = (await getSection<any[]>(section)) ?? [];
  const next = list.filter((x) => String(x[idField]) !== String(id));
  await updateSection(section, next);
  return { success: true };
} 