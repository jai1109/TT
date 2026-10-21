import { SavedHistoryItem, StudentProfile, TabType } from '../types';
import { 
  generateLocalPPT, 
  generateLocalLabRecord, 
  generateLocalAssignment, 
  generateLocalTechTalkReport 
} from './localGenerators';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Rahul Varma',
  rollNo: '22951A05B3',
  branch: 'Computer Science and Engineering (CSE)',
  yearSem: 'III Year I Semester',
};

export const getSavedStudentProfile = (): StudentProfile => {
  try {
    const raw = localStorage.getItem('iare_student_profile');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse student profile', e);
  }
  return DEFAULT_STUDENT_PROFILE;
};

export const saveStudentProfile = (profile: StudentProfile) => {
  try {
    localStorage.setItem('iare_student_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

export const loadHistory = (): SavedHistoryItem[] => {
  try {
    const raw = localStorage.getItem('iare_history');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load history', e);
  }
  return [];
};

export const saveHistoryItem = (type: TabType, title: string, data: any): SavedHistoryItem => {
  const newItem: SavedHistoryItem = {
    id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type,
    title,
    timestamp: new Date().toLocaleString(),
    data,
  };
  try {
    const current = loadHistory();
    const updated = [newItem, ...current.slice(0, 49)]; // store up to 50 items
    localStorage.setItem('iare_history', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history item', e);
  }
  return newItem;
};

export const deleteHistoryItem = (id: string): SavedHistoryItem[] => {
  try {
    const current = loadHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem('iare_history', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return [];
  }
};

export const clearAllHistory = () => {
  try {
    localStorage.removeItem('iare_history');
  } catch (e) {
    console.error('Failed to clear history', e);
  }
};

export async function requestGeneration(
  type: string,
  prompt: string,
  options: any = {},
  studentInfo?: StudentProfile
) {
  const profile = studentInfo || getSavedStudentProfile();
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        prompt,
        options,
        studentInfo: profile,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const json = await res.json();
    if (json.data) {
      return json.data;
    }
    throw new Error('No data in server response');
  } catch (err) {
    console.warn('API fetch error, falling back to local engine:', err);
    if (type === 'ppt') {
      return generateLocalPPT(prompt, options, profile);
    }
    if (type === 'lab_record') {
      return generateLocalLabRecord(prompt, options, profile);
    }
    if (type === 'assignment') {
      return generateLocalAssignment(prompt, options, profile);
    }
    if (type === 'tech_talk') {
      return generateLocalTechTalkReport(prompt, options, profile);
    }
    throw err;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      return success;
    });
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
