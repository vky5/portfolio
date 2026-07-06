import { Reveal } from "@/components/motion/Reveal";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  sub?: string;
};

export default function SectionHeader({ kicker, title, sub }: SectionHeaderProps) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="inline-block h-3 w-px bg-primary" />
        {kicker}
      </p>
      <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-[60ch] text-muted-foreground">{sub}</p>
      )}
    </Reveal>
  );
}
