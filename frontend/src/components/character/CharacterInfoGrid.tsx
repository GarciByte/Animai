import { CharacterDetailResponse } from '@/types/character.types';
import { CharacterDescription } from './CharacterDescription';
import { cleanAge } from '@/lib/character-text';

const GENDER_LABELS: Record<string, string> = {
    Male: 'Masculino',
    Female: 'Femenino',
    'Non-binary': 'No binario',
};

const MONTHS = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function formatBirthday(
    date: { year: number | null; month: number | null; day: number | null } | null,
): string | null {
    if (!date) return null;
    const { day, month, year } = date;
    if (!day && !month && !year) return null;

    const monthName = month ? MONTHS[month - 1] : null;

    if (day && monthName && year) return `${day} de ${monthName} de ${year}`;
    if (day && monthName) return `${day} de ${monthName}`;
    if (monthName && year) return `${monthName} de ${year}`;
    if (year) return String(year);
    return null;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="flex justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
            <span className="text-muted">{label}</span>
            <span className="text-right font-medium text-foreground">{value}</span>
        </div>
    );
}

interface CharacterInfoGridProps {
    target: CharacterDetailResponse;
}

export function CharacterInfoGrid({ target }: CharacterInfoGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card px-4 py-1">
                <InfoRow label="Edad" value={target.age ? cleanAge(target.age) : null} />
                <InfoRow label="Género" value={target.gender ? GENDER_LABELS[target.gender] ?? target.gender : null} />
                <InfoRow label="Grupo sanguíneo" value={target.bloodType} />
                <InfoRow label="Altura" value={target.height} />
                <InfoRow label="Cumpleaños" value={formatBirthday(target.birthday)} />
            </div>

            <div className="md:col-span-2">
                <CharacterDescription target={target} />
            </div>
        </div>
    );
}
