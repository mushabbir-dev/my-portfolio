'use client';

import { useEffect, useState } from 'react';
import type { Certificate } from '../../lib/types';

export default function Certificates() {
  const [list, setList] = useState<Certificate[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/certificates', { cache: 'no-store' });
      const data = await res.json();
      // show only active + with pdf
      const filtered = (data || []).filter((c: Certificate) => c.isActive !== false && c.pdfUrl);
      setList(filtered);
    })();
  }, []);

  if (list.length === 0) return null;

  return (
    <section id="certificates" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Certificates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <div key={c.id} className="rounded-lg border overflow-hidden bg-white/50 dark:bg-zinc-900/50">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.name.english} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-gray-500 text-sm border-b">No image</div>
              )}
              <div className="p-4 space-y-1">
                <div className="font-semibold">{c.name.english}</div>
                <div className="text-sm text-gray-500">{c.issuer.english}</div>
                {c.institute?.english && <div className="text-sm">{c.institute.english}</div>}
                <div className="text-xs text-gray-500">{c.date.english}</div>
                <div className="pt-3">
                  {c.pdfUrl ? (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-block text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View & Download PDF
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">PDF not uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
