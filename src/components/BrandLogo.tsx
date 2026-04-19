const ASMark = ({ size = 44 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    {/* Left diagonal — extended left leg of A */}
    <line x1="11" y1="43" x2="25" y2="10" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    {/* Right leg of A */}
    <line x1="25" y1="10" x2="36" y2="36" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    {/* Crossbar of A */}
    <line x1="19.5" y1="27" x2="31" y2="27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    {/* Letter S */}
    <path
      d="M 48 15 C 48 15 39 13 38 20 C 37 27 48 27 47 34 C 46 41 37 40 37 40"
      stroke="white"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Shield arc */}
    <path
      d="M 11 43 C 12 56 22 63 34 65 C 46 63 57 56 57 43"
      stroke="white"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 36, text: "text-base",  gap: "gap-1.5" },
  md: { icon: 44, text: "text-lg",    gap: "gap-1"   },
  lg: { icon: 56, text: "text-xl",    gap: "gap-2"   },
};

const BrandLogo = ({ size = "md", showText = true, className = "" }: BrandLogoProps) => {
  const s = sizes[size];
  return (
    <span
      className={`flex items-center ${s.gap} ${className}`}
      style={{ userSelect: "none" }}
    >
      <ASMark size={s.icon} />
      {showText && (
        <span
          className={`${s.text} font-bold text-white tracking-wide leading-none`}
          style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
        >
          AutoSafe
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
