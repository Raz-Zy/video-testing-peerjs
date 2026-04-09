"use client";

interface MeetingToolbarProps {
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onLeave: () => void;
}

function ToolBtn({
  active,
  danger,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex flex-col items-center gap-1 rounded-2xl px-5 py-3 text-xs font-medium transition-colors ${
        danger
          ? "bg-red-500 text-white hover:bg-red-600"
          : active
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// --- inline SVG icons ---
const MicOnIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 0 1-14 0M12 19v4M8 23h8" />
  </svg>
);
const MicOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v2a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 0 1 5 10v-1m14 0v1a7 7 0 0 1-.11 1.23M12 19v4M8 23h8" />
  </svg>
);
const CamOnIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const CamOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h2a2 2 0 0 1 2 2v9.34m-7.72-2.06A4 4 0 0 1 7.72 7.72" />
    <polygon points="23 7 16 12 23 17 23 7" />
  </svg>
);
const ScreenIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <polyline points="8 10 12 6 16 10" />
    <line x1="12" y1="6" x2="12" y2="14" />
  </svg>
);
const LeaveIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function MeetingToolbar({
  micOn,
  camOn,
  screenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onLeave,
}: MeetingToolbarProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-gray-900/90 px-6 py-3 backdrop-blur">
      <ToolBtn active={micOn} onClick={onToggleMic} title={micOn ? "Mute" : "Unmute"}>
        {micOn ? <MicOnIcon /> : <MicOffIcon />}
        {micOn ? "Mute" : "Unmute"}
      </ToolBtn>

      <ToolBtn active={camOn} onClick={onToggleCam} title={camOn ? "Turn off camera" : "Turn on camera"}>
        {camOn ? <CamOnIcon /> : <CamOffIcon />}
        {camOn ? "Camera on" : "Camera off"}
      </ToolBtn>

      <ToolBtn active={screenSharing} onClick={onToggleScreen} title={screenSharing ? "Stop sharing" : "Share screen"}>
        <ScreenIcon />
        {screenSharing ? "Stop share" : "Share screen"}
      </ToolBtn>

      <ToolBtn danger onClick={onLeave} title="Leave meeting">
        <LeaveIcon />
        Leave
      </ToolBtn>
    </div>
  );
}
