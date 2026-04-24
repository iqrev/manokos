'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika sudah pernah ditolak
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Tunda 3 detik agar tidak mengganggu UX pertama kali
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-[72px] left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm animate-fade-up">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[var(--color-border)] p-4 flex items-center gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🏠</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-700 text-[14px] text-[var(--color-text-primary)]">Pasang Manokos</p>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-tight mt-0.5">
            Akses lebih cepat, tersedia offline
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="btn btn-primary text-[12px] px-3 py-1.5 gap-1.5 rounded-xl"
            aria-label="Install aplikasi"
          >
            <Download size={13} /> Install
          </button>
          <button
            onClick={handleDismiss}
            className="btn btn-ghost p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            aria-label="Tutup"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
