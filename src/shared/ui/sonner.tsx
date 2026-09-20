import { useTheme as useAppTheme } from "@/app/providers/ThemeProvider";
import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useAppTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
        error: <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
        info: <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />,
        loading: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast relative overflow-hidden !rounded-xl !border !px-4 !py-3 !shadow-[0_12px_35px_-15px_rgba(0,0,0,0.55)] !ring-1 !ring-black/5 dark:!ring-white/10 !backdrop-blur-md supports-[backdrop-filter]:!bg-background/70 !bg-background/95 !text-black dark:!text-white pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-xl before:bg-border animate-in fade-in slide-in-from-right-4 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-4 data-[type=success]:!border-emerald-500/30 data-[type=success]:!bg-emerald-500/10 data-[type=success]:before:bg-emerald-500 data-[type=error]:!border-rose-500/30 data-[type=error]:!bg-rose-500/10 data-[type=error]:before:bg-rose-500 data-[type=warning]:!border-amber-500/30 data-[type=warning]:!bg-amber-500/10 data-[type=warning]:before:bg-amber-500 data-[type=info]:!border-sky-500/30 data-[type=info]:!bg-sky-500/10 data-[type=info]:before:bg-sky-500",
          title: "!text-sm !font-semibold !tracking-tight !text-black dark:!text-white",
          description: "!text-xs !text-black/70 dark:!text-white/75",
          actionButton:
            "!h-8 !rounded-md !px-3 !text-xs !font-medium !bg-primary !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!h-8 !rounded-md !px-3 !text-xs !font-medium !bg-muted !text-foreground hover:!bg-muted/80",
          closeButton:
            "!rounded-md !p-1.5 !text-foreground/50 hover:!text-foreground hover:!bg-muted/60",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

