import Image from 'next/image';
import Link from 'next/link';

interface MiniAnimeCardProps {
    title: string;
    coverImage: string;
    subtitle?: string;
    href?: string;
}

export function MiniAnimeCard({ title, coverImage, subtitle, href }: MiniAnimeCardProps) {
    const content = (
        <>
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card">
                <Image src={coverImage} alt={title} fill sizes="128px" className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent">{title}</p>
            {subtitle && <p className="text-[11px] text-muted">{subtitle}</p>}
        </>
    );

    if (href) {
        return <Link href={href} className="group w-32 shrink-0">{content}</Link>;
    }

    // Sin Link ni clase `group`: las animaciones de hover (que dependen
    // de `group-hover:`) simplemente no se activan, así que ya se ve
    // visualmente como "no interactivo" sin necesitar más estilos.
    return <div className="w-32 shrink-0 cursor-default">{content}</div>;
}
