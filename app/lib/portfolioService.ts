import { supabase, PortfolioSection, AdminLog } from './supabase';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

// File-based storage for persistent data
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');
const BACKUP_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio-backup.json');

// Fallback data storage (in-memory for when database is not available)
let fallbackData: any = null;

// File storage functions
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function saveToFile(data: any) {
  try {
    await ensureDataDirectory();
    await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error saving to file:', error);
  }
}

async function loadFromFile(): Promise<any> {
  try {
    const data = await readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    return parsed;
  } catch (error) {
    
    return null;
  }
}

async function createBackup(data: any) {
  try {
    await ensureDataDirectory();
    await writeFile(BACKUP_FILE_PATH, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
  }
}

// Portfolio database service
export class PortfolioService {
  // Get all portfolio data
  static async getPortfolioData() {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
  
        if (!fallbackData) {
          fallbackData = await loadFromFile();
        }
        return fallbackData || {};
      }

      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .order('section');

      if (error) {
  
        if (!fallbackData) {
          fallbackData = await loadFromFile();
        }
        return fallbackData || {};
      }

      // Convert array of sections back to portfolio object
      const portfolioData: any = {};
      data?.forEach((section: PortfolioSection) => {
        portfolioData[section.section] = section.data;
      });

      // Store in fallback and file for future use
      fallbackData = portfolioData;
      await saveToFile(portfolioData);

      // Log the read operation
      await this.logAdminAction('read', 'all', 'admin@example.com', { sections: data?.length || 0 }, true);

      return portfolioData;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      if (!fallbackData) {
        fallbackData = await loadFromFile();
      }
      await this.logAdminAction('read', 'all', 'admin@example.com', {}, false, error as string);
      return fallbackData || {};
    }
  }

  // Update a specific section
  static async updateSection(section: string, data: any) {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
        fallbackData = fallbackData || {};
        fallbackData[section] = data;
        await saveToFile(fallbackData);
        await createBackup(fallbackData);
        return { success: true };
      }

      const { data: result, error } = await supabase
        .from('portfolio_sections')
        .upsert({
          section,
          data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) {

        fallbackData = fallbackData || {};
        fallbackData[section] = data;
        await saveToFile(fallbackData);
        await createBackup(fallbackData);
        return { success: true };
      }

      // Update fallback data and file
      fallbackData = fallbackData || {};
      fallbackData[section] = data;
      await saveToFile(fallbackData);
      await createBackup(fallbackData);

      // Log the update operation
      await this.logAdminAction('update', section, 'admin@example.com', { data }, true);

      return result;
    } catch (error) {
      console.error('Error updating section:', error);
      // Use fallback even on error
      fallbackData = fallbackData || {};
      fallbackData[section] = data;
      await saveToFile(fallbackData);
      await createBackup(fallbackData);
      await this.logAdminAction('update', section, 'admin@example.com', { data }, false, error as string);
      return { success: true };
    }
  }

  // Delete an item from a section
  static async deleteItem(section: string, key: string) {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
        if (fallbackData && fallbackData[section]) {
          if (Array.isArray(fallbackData[section])) {
            fallbackData[section] = fallbackData[section].filter((item: any) => item.id !== key);
          } else if (typeof fallbackData[section] === 'object') {
            delete fallbackData[section][key];
          }
        }
        await saveToFile(fallbackData);
        await createBackup(fallbackData);
        return { success: true };
      }

      // First get the current section data
      const { data: currentSection } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('section', section)
        .single();

      if (!currentSection) {
        throw new Error(`Section ${section} not found`);
      }

      // Remove the item from the item from the section data
      let updatedData = currentSection.data;
      if (Array.isArray(updatedData)) {
        updatedData = updatedData.filter((item: any) => item.id !== key);
      } else if (typeof updatedData === 'object' && updatedData !== null) {
        delete updatedData[key];
      }

      // Update the section with the modified data
      const { error } = await supabase
        .from('portfolio_sections')
        .update({
          data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('section', section);

      if (error) {
  
        // Use fallback
        if (fallbackData && fallbackData[section]) {
          if (Array.isArray(fallbackData[section])) {
            fallbackData[section] = fallbackData[section].filter((item: any) => item.id !== key);
          } else if (typeof fallbackData[section] === 'object') {
            delete fallbackData[section][key];
          }
        }
        await saveToFile(fallbackData);
        await createBackup(fallbackData);
        return { success: true };
      }

      // Update fallback data and file
      fallbackData = fallbackData || {};
      fallbackData[section] = updatedData;
      await saveToFile(fallbackData);
      await createBackup(fallbackData);

      // Log the delete operation
      await this.logAdminAction('delete', section, 'admin@example.com', { key, section }, true);

      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      // Use fallback even on error
      if (fallbackData && fallbackData[section]) {
        if (Array.isArray(fallbackData[section])) {
          fallbackData[section] = fallbackData[section].filter((item: any) => item.id !== key);
        } else if (typeof fallbackData[section] === 'object') {
          delete fallbackData[section][key];
        }
      }
      await saveToFile(fallbackData);
      await createBackup(fallbackData);
      await this.logAdminAction('delete', section, 'admin@example.com', { key, section }, false, error as string);
      return { success: true };
    }
  }

  // Initialize portfolio data with default values
  static async initializePortfolioData(defaultData: any) {
    try {
      if (!supabase) {
  
        fallbackData = defaultData;
        await saveToFile(defaultData);
        await createBackup(defaultData);
        return { success: true };
      }

      const sections = Object.keys(defaultData);
      const portfolioSections = sections.map(section => ({
        section,
        data: defaultData[section],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('portfolio_sections')
        .upsert(portfolioSections, {
          onConflict: 'section'
        });

      if (error) {
  
        fallbackData = defaultData;
        await saveToFile(defaultData);
        await createBackup(defaultData);
        return { success: true };
      }

      // Store in fallback and file
      fallbackData = defaultData;
      await saveToFile(defaultData);
      await createBackup(defaultData);

      // Log the initialization
      await this.logAdminAction('create', 'initialization', 'admin@example.com', { sections }, true);

      return { success: true };
    } catch (error) {
      console.error('Error initializing portfolio data:', error);
      fallbackData = defaultData;
      await saveToFile(defaultData);
      await createBackup(defaultData);
      await this.logAdminAction('create', 'initialization', 'admin@example.com', {}, false, error as string);
      return { success: true };
    }
  }

  // Log admin actions
  static async logAdminAction(
    action: AdminLog['action'],
    section: string,
    by: string,
    payload: any,
    success: boolean,
    error_message?: string
  ) {
    try {
      if (!supabase) {
  
        return;
      }

      const logEntry: Omit<AdminLog, 'id'> = {
        action,
        section,
        by,
        time: new Date().toISOString(),
        payload,
        success,
        error_message
      };

      const { error } = await supabase
        .from('admin_logs')
        .insert(logEntry);

      if (error) {
        console.error('Error logging admin action:', error);
      }
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  // Get admin logs (for admin panel)
  static async getAdminLogs(limit = 50) {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
  
        return [];
      }

      const { data, error } = await supabase
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