'use client';

import { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    isLoading?: boolean;
}

export function SearchBar({
    value, onChange, onSearch, placeholder = 'Buscar…', isLoading,
}: SearchBarProps) {
    // Enter también dispara la búsqueda — sigue siendo una acción explícita
    // del usuario, no una búsqueda automática mientras escribe.
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div className="flex w-full gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
            </div>
            <Button onClick={onSearch} isLoading={isLoading} size="md">
                Buscar
            </Button>
        </div>
    );
}
