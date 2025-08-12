import { supabaseAdmin } from './supabase-server';

type PortfolioJSON = Record<string, any>;
const ROW_ID = 1;

export async function getPortfolioData(): Promise<PortfolioJSON> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('portfolio').select('data').eq('id', ROW_ID).single();
  if (error) throw new Error(`getPortfolioData failed: ${error.message}`);
  return (data?.data ?? {}) as PortfolioJSON;
}

export async function updateSection(section: string, payload: any) {
  const sb = supabaseAdmin();
  const { data: row, error: e1 } = await sb.from('portfolio').select('data').eq('id', ROW_ID).single();
  if (e1) throw new Error(`read before update failed: ${e1.message}`);

  const next = { ...(row?.data ?? {}), [section]: payload };
  const { error: e2 } = await sb.from('portfolio').update({ data: next }).eq('id', ROW_ID);
  if (e2) throw new Error(`updateSection failed: ${e2.message}`);

  return { success: true };
}

// Legacy methods for backward compatibility
export class PortfolioService {
  static async getPortfolioData() {
    return getPortfolioData();
  }

  static async updateSection(section: string, data: any) {
    return updateSection(section, data);
  }

  static async deleteItem(section: string, key: string) {
    const sb = supabaseAdmin();
    const { data: row, error: e1 } = await sb.from('portfolio').select('data').eq('id', ROW_ID).single();
    if (e1) throw new Error(`read before delete failed: ${e1.message}`);

    let updatedData = row?.data;
    if (Array.isArray(updatedData?.[section])) {
      updatedData[section] = updatedData[section].filter((item: any) => item.id !== key);
    } else if (typeof updatedData?.[section] === 'object' && updatedData?.[section] !== null) {
      delete updatedData[section][key];
    }

    const next = { ...updatedData };
    const { error: e2 } = await sb.from('portfolio').update({ data: next }).eq('id', ROW_ID);
    if (e2) throw new Error(`deleteItem failed: ${e2.message}`);

    return { success: true };
  }

  static async initializePortfolioData(defaultData: any) {
    const sb = supabaseAdmin();
    const { error } = await sb.from('portfolio').upsert({
      id: ROW_ID,
      data: defaultData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });
    
    if (error) throw new Error(`initializePortfolioData failed: ${error.message}`);
    return { success: true };
  }

  static async logAdminAction(
    action: string,
    section: string,
    by: string,
    payload: any,
    success: boolean,
    error_message?: string
  ) {
    try {
      const sb = supabaseAdmin();
      const logEntry = {
        action,
        section,
        by,
        time: new Date().toISOString(),
        payload,
        success,
        error_message
      };

      const { error } = await sb
        .from('admin_logs')
        .insert(logEntry);

      if (error) {
        console.error('Error logging admin action:', error);
      }
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  static async getAdminLogs(limit = 50) {
    try {
      const sb = supabaseAdmin();
      const { data, error } = await sb
        .from('admin_logs')
        .select('*')
        .order('time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
  }
} 