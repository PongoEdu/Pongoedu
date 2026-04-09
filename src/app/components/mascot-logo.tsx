export function MascotLogo() {
  return (
    <div className="relative flex items-end gap-2">
      {/* Macaco-prego estilo Duolingo */}
      <svg
        width="60"
        height="70"
        viewBox="0 0 60 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cabeça principal */}
        <ellipse cx="30" cy="28" rx="18" ry="20" fill="#8B6914" />
        
        {/* Tufo de cabelo característico */}
        <path
          d="M 20 12 Q 25 8 30 10 Q 35 8 40 12 L 38 18 Q 30 14 22 18 Z"
          fill="#6B4E0A"
        />
        
        {/* Orelhas grandes e redondas */}
        <ellipse cx="12" cy="22" rx="6" ry="8" fill="#A0792D" />
        <ellipse cx="48" cy="22" rx="6" ry="8" fill="#A0792D" />
        <ellipse cx="12" cy="23" rx="3.5" ry="5" fill="#D4A574" />
        <ellipse cx="48" cy="23" rx="3.5" ry="5" fill="#D4A574" />
        
        {/* Rosto mais claro */}
        <ellipse cx="30" cy="32" rx="14" ry="12" fill="#D4A574" />
        
        {/* Olhos grandes e expressivos - estilo Duolingo */}
        <g>
          {/* Olho esquerdo */}
          <ellipse cx="24" cy="28" rx="5" ry="6" fill="white" />
          <ellipse cx="24.5" cy="29" rx="3" ry="3.5" fill="#2C1810" />
          <ellipse cx="25.5" cy="27.5" rx="1.5" ry="2" fill="white" />
          
          {/* Olho direito */}
          <ellipse cx="36" cy="28" rx="5" ry="6" fill="white" />
          <ellipse cx="36.5" cy="29" rx="3" ry="3.5" fill="#2C1810" />
          <ellipse cx="37.5" cy="27.5" rx="1.5" ry="2" fill="white" />
        </g>
        
        {/* Sobrancelhas expressivas */}
        <path d="M 19 24 Q 22 22 26 23" stroke="#6B4E0A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 41 24 Q 38 22 34 23" stroke="#6B4E0A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Nariz pequeno e fofo */}
        <ellipse cx="30" cy="34" rx="2.5" ry="2" fill="#8B6914" />
        
        {/* Boca sorridente */}
        <path
          d="M 24 38 Q 30 42 36 38"
          stroke="#6B4E0A"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Jaleco branco */}
        <g>
          {/* Corpo do jaleco */}
          <path
            d="M 18 48 L 18 66 Q 18 68 20 68 L 40 68 Q 42 68 42 66 L 42 48 Q 42 46 40 46 L 35 46 L 35 50 L 30 50 L 30 46 L 25 46 L 25 50 L 20 50 L 20 46 Q 18 46 18 48 Z"
            fill="white"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
          
          {/* Gola do jaleco */}
          <path
            d="M 20 46 L 22 44 L 25 46"
            fill="white"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
          <path
            d="M 40 46 L 38 44 L 35 46"
            fill="white"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
          
          {/* Bolsos do jaleco */}
          <rect x="21" y="56" width="7" height="6" rx="1" fill="none" stroke="#E5E5E5" strokeWidth="1" />
          <rect x="32" y="56" width="7" height="6" rx="1" fill="none" stroke="#E5E5E5" strokeWidth="1" />
        </g>
        
        {/* Braço esquerdo segurando erlenmeyer */}
        <g>
          <ellipse cx="12" cy="54" rx="3.5" ry="7" fill="#8B6914" transform="rotate(-30 12 54)" />
          <ellipse cx="8" cy="60" rx="3" ry="3.5" fill="#D4A574" />
          
          {/* Erlenmeyer na mão */}
          <g transform="translate(0, 58)">
            {/* Gargalo */}
            <rect x="6" y="0" width="4" height="6" fill="#88D4F5" fillOpacity="0.3" />
            
            {/* Corpo cônico */}
            <path
              d="M 6 6 L 2 14 Q 2 16 4 17 L 12 17 Q 14 16 14 14 L 10 6 Z"
              fill="#88D4F5"
              fillOpacity="0.4"
              stroke="#5EB3D6"
              strokeWidth="1"
            />
            
            {/* Líquido verde */}
            <path
              d="M 7 9 L 4 14 Q 4 15 5 15.5 L 11 15.5 Q 12 15 12 14 L 9 9 Z"
              fill="#58cc02"
              fillOpacity="0.7"
            />
            
            {/* Bolhas */}
            <circle cx="7" cy="12" r="0.8" fill="white" fillOpacity="0.6" />
            <circle cx="9" cy="13" r="0.6" fill="white" fillOpacity="0.6" />
          </g>
        </g>
        
        {/* Braço direito */}
        <ellipse cx="48" cy="54" rx="3.5" ry="7" fill="#8B6914" transform="rotate(30 48 54)" />
      </svg>

      {/* Frasco de poção */}
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tampa */}
        <rect x="11" y="2" width="10" height="3" rx="1" fill="#8B7355" />
        <rect x="9" y="4" width="14" height="2" rx="1" fill="#A0846B" />
        
        {/* Gargalo */}
        <rect x="12" y="6" width="8" height="4" fill="#88D4F5" fillOpacity="0.3" />
        
        {/* Corpo do frasco */}
        <path
          d="M 12 10 L 8 16 Q 6 20 6 25 Q 6 32 8 35 Q 10 38 16 38 Q 22 38 24 35 Q 26 32 26 25 Q 26 20 24 16 L 20 10 Z"
          fill="#88D4F5"
          fillOpacity="0.4"
          stroke="#5EB3D6"
          strokeWidth="1.5"
        />
        
        {/* Líquido dentro */}
        <path
          d="M 9 25 Q 9 28 10 31 Q 12 35 16 35 Q 20 35 22 31 Q 23 28 23 25 Q 23 20 21 16 L 11 16 Q 9 20 9 25 Z"
          fill="#58cc02"
          fillOpacity="0.6"
        />
        
        {/* Bolhas */}
        <circle cx="14" cy="26" r="1.5" fill="white" fillOpacity="0.6" />
        <circle cx="18" cy="23" r="1" fill="white" fillOpacity="0.6" />
        <circle cx="16" cy="30" r="1" fill="white" fillOpacity="0.5" />
        
        {/* Brilho no vidro */}
        <path
          d="M 10 18 Q 11 16 13 15 L 13 20 Z"
          fill="white"
          fillOpacity="0.4"
        />
      </svg>
    </div>
  );
}