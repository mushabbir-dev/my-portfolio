import { supabaseAdmin } from './supabase-server';

type JSONValue = any;
const ROW_ID = 1;

export async function getPortfolioData(): Promise<JSONValue> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('portfolio')
    .select('data')
    .eq('id', ROW_ID)
    .single();
  if (error) throw new Error(`getPortfolioData failed: ${error.message}`);
  return data?.data ?? {};
}

export async function setPortfolioData(next: JSONValue) {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from('portfolio')
    .update({ data: next })
    .eq('id', ROW_ID);
  if (error) throw new Error(`setPortfolioData failed: ${error.message}`);
}

export async function getSection<T = any>(section: string): Promise<T | undefined> {
  const data = await getPortfolioData();
  return data?.[section];
}

export async function updateSection(section: string, next: any) {
  const data = await getPortfolioData();
  const updated = { ...(data || {}), [section]: next };
  await setPortfolioData(updated);
  return updated;
}

function ensureId<T extends Record<string, any>>(raw: T): T & { id: string } {
  if (!raw.id) {
    (raw as any).id = crypto.randomUUID();
  }
  return raw as T & { id: string };
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

export async function deleteItem(section: string, id: string, idField = 'id') {
  const list = (await getSection<any[]>(section)) ?? [];
  const next = list.filter((x) => String(x[idField]) !== String(id));
  await updateSection(section, next);
  return { success: true };
} 