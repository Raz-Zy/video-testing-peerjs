"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

export default function MeetingPage() {
  const router = useRouter();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleNewMeeting() {
    const roomId = crypto.randomUUID();
    const link = `${window.location.origin}/meeting/room/${roomId}`;
    setGeneratedLink(link);
    setCopied(false);
  }

  async function handleCopy() {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleJoin() {
    const raw = joinInput.trim();
    if (!raw) return;

    // Accept either a full URL or a bare room ID
    let roomId = raw;
    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      roomId = parts[parts.length - 1];
    } catch {
      // not a URL, treat as plain room ID
    }

    if (roomId) router.push(`/meeting/room/${roomId}`);
  }

  function handleJoinGenerated() {
    if (generatedLink) {
      const parts = generatedLink.split("/").filter(Boolean);
      const roomId = parts[parts.length - 1];
      router.push(`/meeting/room/${roomId}`);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white">
            <VideoIcon />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Video meetings</h1>
          <p className="mt-2 text-gray-500">Connect with others instantly from your browser</p>
        </div>

        {/* New meeting card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Start a new meeting
          </h2>
          <button
            onClick={handleNewMeeting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            <VideoIcon />
            New Meeting
          </button>

          {generatedLink && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-medium text-gray-500">Your meeting link</p>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="flex-1 truncate text-xs text-gray-700">{generatedLink}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={handleJoinGenerated}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Join this meeting →
              </button>
            </div>
          )}
        </div>

        {/* Join existing card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Join an existing meeting
          </h2>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Paste a room ID or meeting link"
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
            />
            <button
              onClick={handleJoin}
              disabled={!joinInput.trim()}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-40"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
