// components/BackgroundHalo.tsx
export default function BackgroundHalo() {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Top-right glow */}
        <div
          className="absolute -top-40 right-[-10rem] h-[28rem] w-[28rem]
                     rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500
                     opacity-40 blur-3xl bg-orbit"
        />
  
        {/* Bottom-left glow */}
        <div
          className="absolute bottom-[-10rem] -left-32 h-[30rem] w-[30rem]
                     rounded-full bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-500
                     opacity-35 blur-3xl bg-orbit-delayed"
        />
      </div>
    );
  }
  