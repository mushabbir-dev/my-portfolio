'use client';

import { useEffect, useState } from 'react';
import type { Certificate } from '../../lib/types';

export default function Certificates() {
  const [list, setList] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch('/api/certificates', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('🔍 Certificates API response:', data);
        
        // show only active + with pdf
        const filtered = (data || []).filter((c: Certificate) => c.isActive !== false && c.pdfUrl);
        console.log('🔍 Filtered certificates:', filtered);
        
        setList(filtered);
      } catch (err) {
        console.error('❌ Error fetching certificates:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text">
            Certifications
          </h2>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading certificates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text">
            Certifications
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              Error Loading Certificates
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text">
            Certifications
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              No Certificates Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Certificates will appear here once they are added to your portfolio.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text">
          Certifications
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <div key={c.id} className="rounded-lg border overflow-hidden bg-white/50 dark:bg-zinc-900/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.name.english} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-gray-500 text-sm border-b bg-gray-100 dark:bg-gray-800">
                  📜 No Image
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">
                  {c.name.english}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {c.issuer.english}
                </div>
                {c.institute?.english && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {c.institute.english}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {c.date.english}
                </div>
                <div className="pt-3">
                  {c.pdfUrl ? (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-block text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      📄 View & Download PDF
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
