'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    closable?: boolean;
}

export function Modal({ isOpen, onClose, title, children, closable = true }: ModalProps) {
    // Bloquea el scroll del body mientras el modal está abierto
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Cierre con Escape — solo si closable
    useEffect(() => {
        if (!isOpen || !closable) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, closable, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
            onClick={closable ? onClose : undefined}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    {closable && (
                        <button
                            onClick={onClose}
                            className="rounded-full p-1.5 text-muted hover:bg-background hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            </div>
        </div>
    );
}
