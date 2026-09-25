import React from 'react';

interface DevLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  variant?: 'svg' | 'image';
  withText?: boolean;
}

export const ZENONE_LOGO_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663911894181/KneTWKJcOsbgtkZh.png";

export const DevLogo: React.FC<DevLogoProps> = ({
  className = "h-8 w-auto",
  height,
  width,
  withText = false,
}) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src={ZENONE_LOGO_URL}
        alt="Zenone Logo"
        referrerPolicy="no-referrer"
        className="h-full w-auto object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105"
        style={{ height, width }}
        onError={(e) => {
          // Fallback if network blocked
          e.currentTarget.style.display = 'none';
        }}
      />
      {withText && (
        <span className="font-black text-xl tracking-tight text-white font-sans">
          Zenone
        </span>
      )}
    </div>
  );
};

export default DevLogo;
