import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Zap, TrendingUp, Rocket, Sparkles } from "lucide-react";

const STORAGE_KEY = "cryptomind_upgrade_v3.1_seen";

export default function UpgradeAnnouncementModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
            const timer = setTimeout(() => setOpen(true), 600);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) handleDismiss();
            }}
        >
            <DialogContent
                className="
          w-[calc(100%-2rem)] max-w-md mx-auto
          rounded-2xl border border-border/60
          bg-card/95 backdrop-blur-xl
          p-0 gap-0 overflow-hidden
          shadow-xl
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        "
            >
                {/* Top gradient accent bar */}
                <div className="h-1 w-full gradient-primary" />

                {/* Content wrapper */}
                <div className="relative px-5 pt-5 pb-5 sm:px-8 sm:pt-6 sm:pb-6">
                    {/* Background glow */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-0 w-48 h-48 rounded-full bg-accent/8 blur-3xl" />

                    {/* Badge */}
                    <div className="relative flex justify-center mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/30 bg-primary/10 text-primary">
                            <Sparkles className="w-3 h-3" />
                            Upgrade Live
                        </span>
                    </div>

                    {/* Icon - Compacted */}
                    <div className="relative flex justify-center mb-3">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl scale-125" />
                            <div className="relative w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 neon-border">
                                <Rocket className="w-6 h-6 text-primary-foreground drop-shadow-md" />
                            </div>
                        </div>
                    </div>

                    <DialogHeader className="relative space-y-1.5 mb-4">
                        <DialogTitle className="text-center text-xl font-bold tracking-tight text-foreground">
                            Signalix V2 Just Got Smarter
                        </DialogTitle>
                        <DialogDescription className="text-center text-[13px] leading-relaxed text-muted-foreground max-w-[340px] mx-auto">
                            We've upgraded to{" "}
                            <span className="font-bold text-primary">
                                Gemini 3.1 Pro
                            </span>{" "}
                            — Google's latest and most advanced reasoning model for sharper market insights.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Feature cards - More compact vertical padding */}
                    <div className="relative grid gap-2 mb-5">
                        <FeatureRow
                            icon={<Brain className="w-3.5 h-3.5" />}
                            title="Advanced Reasoning"
                            description="Deeper strategic thinking for complex markets"
                            variant="primary"
                        />
                        <FeatureRow
                            icon={<TrendingUp className="w-3.5 h-3.5" />}
                            title="Sharper Predictions"
                            description="More accurate entry and exit targets"
                            variant="accent"
                        />
                        <FeatureRow
                            icon={<Zap className="w-3.5 h-3.5" />}
                            title="Faster Processing"
                            description="Real-time AI analysis with zero delay"
                            variant="chart"
                        />
                    </div>

                    {/* CTA */}
                    <div className="relative flex justify-center">
                        <Button
                            id="upgrade-modal-dismiss-btn"
                            onClick={handleDismiss}
                            size="default"
                            className="w-full sm:w-auto min-w-[160px] h-11 font-bold gradient-primary text-primary-foreground rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Let's Go 🚀
                        </Button>
                    </div>

                    <p className="relative text-center text-[10px] font-medium text-muted-foreground/50 mt-4">
                        Powered by Gemini 3.1 Pro
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeatureRow({
    icon,
    title,
    description,
    variant,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    variant: "primary" | "accent" | "chart";
}) {
    const styles = {
        primary: {
            card: "border-primary/20 bg-primary/5",
            icon: "bg-primary/15 text-primary",
        },
        accent: {
            card: "border-accent/20 bg-accent/5",
            icon: "bg-accent/15 text-accent",
        },
        chart: {
            card: "border-chart-4/20 bg-chart-4/5",
            icon: "bg-chart-4/15 text-chart-4",
        },
    };

    const s = styles[variant];

    return (
        <div
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors duration-200 ${s.card}`}
        >
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${s.icon}`}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground/90 leading-tight">
                    {title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
}
