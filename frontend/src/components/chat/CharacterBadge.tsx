import Image from 'next/image';
import { SelectedCharacter } from '@/types/ai.types';

type BadgeSize = 'sm' | 'md' | 'lg';

interface CharacterBadgeProps {
    character: SelectedCharacter;
    size?: BadgeSize;
    showAnimeName?: boolean;
    hideNameOnMobile?: boolean;
}

const SIZE_PX: Record<BadgeSize, number> = { sm: 28, md: 40, lg: 56 };
const SIZE_CLASSES: Record<BadgeSize, string> = {
    sm: 'h-7 w-7',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
};

export function CharacterBadge({
    character, size = 'md', showAnimeName = false, hideNameOnMobile = false,
}: CharacterBadgeProps) {
    const px = SIZE_PX[size];

    return (
        <div className="flex items-center gap-3">
            <Image
                src={character.image}
                alt={character.characterName}
                width={px}
                height={px}
                className={`${SIZE_CLASSES[size]} shrink-0 rounded-full object-cover`}
            />
            <div className={hideNameOnMobile ? 'hidden sm:block' : ''}>
                <p className="text-sm font-semibold leading-tight">{character.characterName}</p>
                {showAnimeName && (
                    <p className="text-xs leading-tight text-muted">{character.animeName}</p>
                )}
            </div>
        </div>
    );
}
