import logo from "@/logo.png";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start" data-testid="typing-indicator">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
        <img src={logo} alt="Signalix V2" className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-bold text-primary/80 uppercase ml-2 tracking-widest">Signalix V2</span>
        <div className="bg-card/50 border border-primary/20 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-premium animate-pulse">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
