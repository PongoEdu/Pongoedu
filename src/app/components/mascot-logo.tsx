import pongoLogo from "../../assets/Pongo.svg";

export function MascotLogo({ size = 58 }: { size?: number }) {
  return (
    <img
      src={pongoLogo}
      alt="PongoEdu"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
      className="shrink-0 select-none"
      draggable={false}
    />
  );
}

interface BrandLogoProps {
  subtitle?: string;
  size?: number;
  titleSize?: number;
  className?: string;
}

/** Logo + título "PongoEdu" (Pongo verde / Edu roxo) + subtítulo. */
export function BrandLogo({
  subtitle = "Laboratórios Educacionais",
  size = 58,
  titleSize = 22,
  className = "",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 min-w-0 ${className}`}>
      <MascotLogo size={size} />
      <div className="min-w-0">
        <div
          className="font-black leading-none"
          style={{ fontSize: titleSize, fontWeight: 900, lineHeight: 1 }}
        >
          <span style={{ color: "var(--green)" }}>Pongo</span>
          <span style={{ color: "var(--purple)" }}>Edu</span>
        </div>
        <div
          className="truncate"
          style={{ fontSize: 12, color: "#65718a", marginTop: 6, fontWeight: 400 }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
