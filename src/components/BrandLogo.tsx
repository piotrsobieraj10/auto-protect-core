const ALT = "AutoSafe - zabezpieczenia antykradzieżowe GPS immobilizer";

const ShieldMark = ({ size = 40, glow = true }: { size?: number; glow?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 66"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={ALT}
    style={{ flexShrink: 0 }}
  >
    <defs>
      <filter id="asglow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="asglowblue" x="-80%" y="-80%" width="260%" height="260%">
        <feColorMatrix in="SourceGraphic" type="matrix"
          values="0.5 0 0 0 0.3
                  0.5 0 0 0 0.6
                  1   0 0 0 1
                  0   0 0 1 0"
          result="blue" />
        <feGaussianBlur in="blue" stdDeviation="4" result="blueblur" />
        <feMerge>
          <feMergeNode in="blueblur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Shield outline */}
    <path
      d="M 10 16 Q 10 5 21 5 H 39 Q 50 5 50 16 V 38 L 30 61 L 10 38 Z"
      stroke="white"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
      opacity="0.9"
    />

    {/* AS letters with blue glow */}
    <text
      x="30"
      y="36"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="22"
      fontWeight="800"
      fontFamily="'Arial Black', 'Arial Bold', Helvetica, sans-serif"
      fill="white"
      letterSpacing="-0.5"
      filter={glow ? "url(#asglowblue)" : undefined}
    >
      AS
    </text>
  </svg>
);

interface BrandLogoProps {
  iconSize?: number;
  mobileIconSize?: number;
  textSize?: string;
  opacity?: number;
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

const BrandLogo = ({
  iconSize = 40,
  mobileIconSize,
  textSize = "text-lg",
  opacity = 1,
  showText = true,
  className = "",
  glow = true,
}: BrandLogoProps) => {
  const mobile = mobileIconSize ?? Math.round(iconSize * 0.8);

  return (
    <span
      className={`flex items-center gap-2 transition-transform duration-200 hover:scale-105 ${className}`}
      style={{ opacity, userSelect: "none" }}
      aria-label={ALT}
    >
      {/* Desktop icon */}
      <span className="hidden sm:block">
        <ShieldMark size={iconSize} glow={glow} />
      </span>
      {/* Mobile icon */}
      <span className="block sm:hidden">
        <ShieldMark size={mobile} glow={glow} />
      </span>

      {showText && (
        <span
          className={`${textSize} font-bold text-white tracking-wide leading-none`}
          style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
        >
          AutoSafe
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
