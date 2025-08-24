'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Certificate, Localized } from '../../lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Trash2, FileText, Image as ImageIcon, Save, Edit3, Plus, Download } from 'lucide-react';

const emptyLoc = () => ({ english: '', japanese: '' });
const emptyCert = (): Certificate => ({
  id: uuidv4(),
  name: emptyLoc(),
  issuer: emptyLoc(),
  institute: emptyLoc(),
  date: emptyLoc(),
  imageUrl: '',
  imageKey: '',
  pdfUrl: '',
  pdfKey: '',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function CertificatesSection() {
  const [list, setList] = useState<Certificate[]>([]);
  const [draft, setDraft] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchList() {
    setLoading(true);
    const res = await fetch('/api/certificates', { cache: 'no-store' });
    const data = await res.json();
    setList(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchList(); }, []);

  function onEdit(c: Certificate) {
    setDraft(JSON.parse(JSON.stringify(c)));
  }
  function onAdd() {
    setDraft(emptyCert());
  }

  async function onSave() {
    if (!draft) return;
    const method = list.some((c) => c.id === draft.id) ? 'PUT' : 'POST';
    const res = await fetch('/api/certificates', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      alert('Save failed');
      return;
    }
    setDraft(null);
    await fetchList();
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this certificate? This will also remove any stored files.')) return;
    const res = await fetch('/api/certificates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    await fetchList();
  }

  async function uploadFile(certificateId: string, kind: 'image' | 'pdf', file: File) {
    const fd = new FormData();
    fd.append('certificateId', certificateId);
    fd.append('kind', kind);
    fd.append('file', file);
    const res = await fetch('/api/certificates/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error || 'Upload failed');
    }
    await fetchList();
  }

  const Card = ({ c }: { c: Certificate }) => (
    <div className="rounded-lg border p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-lg font-semibold">{c.name.english || '(No title EN)'}</div>
          <div className="text-sm text-gray-500">{c.name.japanese || '(No title JP)'}</div>
          <div className="text-sm">
            <span className="text-gray-500">Issuer:</span> {c.issuer.english}
          </div>
          {c.institute?.english && (
            <div className="text-sm">
              <span className="text-gray-500">Institute:</span> {c.institute.english}
            </div>
          )}
          <div className="text-sm">
            <span className="text-gray-500">Date:</span> {c.date.english}
          </div>
          <div className="flex gap-2 mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-zinc-800">
              <ImageIcon size={16} />
              <span>{c.imageUrl ? 'Replace image' : 'Upload image'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    try { await uploadFile(c.id, 'image', f); } catch (err: any) { alert(err.message); }
                  }
                }}
              />
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-zinc-800">
              <FileText size={16} />
              <span>{c.pdfUrl ? 'Replace PDF' : 'Upload PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    try { await uploadFile(c.id, 'pdf', f); } catch (err: any) { alert(err.message); }
                  }
                }}
              />
            </label>
            {c.pdfUrl && (
              <a
                href={c.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <Download size={16} /> View/Download PDF
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {c.imageUrl ? (
            <img src={c.imageUrl} alt={c.name.english} className="w-40 h-28 object-cover rounded border" />
          ) : (
            <div className="w-40 h-28 rounded border flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(c)}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Edit3 size={16} /> Edit
            </button>
            <button
              onClick={() => onDelete(c.id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Certificates</h2>
        <button onClick={onAdd} className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : list.length === 0 ? (
        <div className="text-sm text-gray-500">No certificates yet.</div>
      ) : (
        <div className="grid gap-4">
          {list.map((c) => <Card key={c.id} c={c} />)}
        </div>
      )}

      {draft && (
        <div className="rounded-lg border p-4 bg-white/70 dark:bg-zinc-900/70 space-y-3">
          <h3 className="text-lg font-semibold">Edit Certificate</h3>

          {/* simple EN/JP inputs */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500">Name (EN)</label>
              <input className="w-full input" value={draft.name.english} onChange={e => setDraft({ ...draft, name: { ...draft.name, english: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Name (JP)</label>
              <input className="w-full input" value={draft.name.japanese} onChange={e => setDraft({ ...draft, name: { ...draft.name, japanese: e.target.value } })} />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Issuer (EN)</label>
              <input className="w-full input" value={draft.issuer.english} onChange={e => setDraft({ ...draft, issuer: { ...draft.issuer, english: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Issuer (JP)</label>
              <input className="w-full input" value={draft.issuer.japanese} onChange={e => setDraft({ ...draft, issuer: { ...draft.issuer, japanese: e.target.value } })} />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Institute (EN)</label>
              <input className="w-full input" value={draft.institute?.english || ''} onChange={e => setDraft({ ...draft, institute: { ...(draft.institute || { english: '', japanese: '' }), english: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Institute (JP)</label>
              <input className="w-full input" value={draft.institute?.japanese || ''} onChange={e => setDraft({ ...draft, institute: { ...(draft.institute || { english: '', japanese: '' }), japanese: e.target.value } })} />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Date (EN)</label>
              <input className="w-full input" placeholder="e.g., 2025-07" value={draft.date.english} onChange={e => setDraft({ ...draft, date: { ...draft.date, english: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Date (JP)</label>
              <input className="w-full input" value={draft.date.japanese} onChange={e => setDraft({ ...draft, date: { ...draft.date, japanese: e.target.value } })} />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onSave} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
              <Save size={16} /> Save
            </button>
            <button onClick={() => setDraft(null)} className="px-3 py-2 rounded border">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
