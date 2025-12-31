export function WavesHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 h-48">
      <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        {/* Ola 1 - Muy oscura (primary-800) */}
        <path
          d="M0,32 C240,96 480,96 720,64 C960,32 1200,0 1440,32 L1440,0 L0,0 Z"
          fill="#6D28D9"
        />
        {/* Ola 2 - Oscura (primary-700) */}
        <path
          d="M0,64 C240,128 480,128 720,96 C960,64 1200,32 1440,64 L1440,0 L0,0 Z"
          fill="#7C3AED"
          opacity="0.9"
        />
        {/* Ola 3 - Media */}
        <path
          d="M0,96 C240,160 480,160 720,128 C960,96 1200,64 1440,96 L1440,0 L0,0 Z"
          fill="#8B5CF6"
          opacity="0.7"
        />
        {/* Ola 4 - Clara */}
        <path
          d="M0,128 C240,192 480,192 720,160 C960,128 1200,96 1440,128 L1440,0 L0,0 Z"
          fill="#A78BFA"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
