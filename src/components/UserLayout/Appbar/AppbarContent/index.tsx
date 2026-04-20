import Account from "./Account";
import Hamburger from "./Hamburger";
import Image from "next/image";
import LiveDateTime from "./LiveDateTime";
import NotificationBell from "./NotificationBell";

const AppBarContent = ({ showBurger = false }: { showBurger?: boolean }) => {
  return (
    <>
      {/* ── Hamburger ─────────────────────────────────────────── */}
      {!showBurger && (
        <div className="mr-1 flex items-center justify-center rounded-lg transition-colors">
          <Hamburger />
        </div>
      )}

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Logo ring */}
        <div
          className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{
            width: 36,
            height: 36,
            background: "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          <Image src="/denr.png" alt="DENR Logo" width={30} height={30} className="rounded-full object-cover" />
        </div>

        {/* Name + tagline */}
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[14px] font-bold  tracking-wide">DENR — CENRO</span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em]">Permit Verification System</span>
        </div>
      </div>

      {/* ── Spacer ────────────────────────────────────────────── */}
      <div className="grow" />

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="mx-3 hidden md:block h-6 w-px" style={{ background: "rgba(255,255,255,0.15)" }} />

      {/* ── Account ───────────────────────────────────────────── */}
      <LiveDateTime />

      <NotificationBell />

      <Account />
    </>
  );
};

export default AppBarContent;
