const ASLogo = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="AutoSafe logo"
  >
    {/* Letter A — left leg extended downward (becomes left side of shield arc) */}
    <line x1="13" y1="47" x2="27" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    {/* Letter A — right leg */}
    <line x1="27" y1="11" x2="38" y2="38" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    {/* Letter A — crossbar */}
    <line x1="21" y1="29" x2="34" y2="29" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

    {/* Letter S */}
    <path
      d="M 50 15
         C 50 15 41 13 40 20
         C 39 27 50 27 49 34
         C 48 41 39 40 39 40"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Shield arc — bottom, sweeping from below A's left leg to right end */}
    <path
      d="M 13 47 C 14 60 24 67 36 69 C 48 67 59 60 59 47"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default ASLogo;
