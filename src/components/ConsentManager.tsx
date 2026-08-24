import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ConsentState = {
  analytics: boolean;
  ads: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "suaobracerta-consent-v1";
const ANALYTICS_ID = "G-2498995671";
const ADS_CLIENT = "ca-pub-7650087188632188";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const readConsent = (): ConsentState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as ConsentState;
    return typeof parsed.analytics === "boolean" && typeof parsed.ads === "boolean" ? parsed : null;
  } catch {
    return null;
  }
};

const pushConsentMode = (state: ConsentState | null) => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args));
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  if (state) {
    window.gtag("consent", "update", {
      ad_storage: state.ads ? "granted" : "denied",
      ad_user_data: state.ads ? "granted" : "denied",
      ad_personalization: state.ads ? "granted" : "denied",
      analytics_storage: state.analytics ? "granted" : "denied",
    });
  }
};

const loadScript = (id: string, src: string, attributes: Record<string, string> = {}) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
};

const loadApprovedServices = (state: ConsentState) => {
  if (state.analytics) {
    loadScript("google-analytics-script", `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`);
    window.gtag?.("js", new Date());
    window.gtag?.("config", ANALYTICS_ID, { anonymize_ip: true });
  }
  if (state.ads) {
    loadScript("google-adsense-script", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`, { crossorigin: "anonymous" });
  }
};

const ConsentManager = () => {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reveal = window.requestAnimationFrame(() => setReady(true));
    const stored = readConsent();
    pushConsentMode(stored);
    if (stored) {
      setConsent(stored);
      setAnalytics(stored.analytics);
      setAds(stored.ads);
      loadApprovedServices(stored);
    }
    const openPreferences = () => setOpen(true);
    window.addEventListener("suaobracerta:open-consent", openPreferences);
    return () => { window.cancelAnimationFrame(reveal); window.removeEventListener("suaobracerta:open-consent", openPreferences); };
  }, []);

  const save = (next: Omit<ConsentState, "updatedAt">) => {
    const value: ConsentState = { ...next, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    pushConsentMode(value);
    loadApprovedServices(value);
    setConsent(value);
    setOpen(false);
  };

  const rejectAll = () => save({ analytics: false, ads: false });
  const acceptAll = () => save({ analytics: true, ads: true });

  if (!ready || (consent && !open)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-700 bg-slate-950 p-4 text-white shadow-2xl" role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <div className="container max-w-5xl">
        <h2 id="consent-title" className="text-base font-bold">Suas escolhas de privacidade</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">Usamos tecnologias necessárias para o funcionamento. Analytics e publicidade só são ativados com sua permissão. Você pode aceitar, recusar ou alterar as escolhas a qualquer momento.</p>
        {open && consent && (
          <div className="mt-4 grid gap-3 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm sm:grid-cols-2">
            <label className="flex items-start gap-3"><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="mt-1" /><span><strong>Medição (Analytics)</strong><br /><span className="text-slate-400">Ajuda a entender visitas e erros de forma agregada.</span></span></label>
            <label className="flex items-start gap-3"><input type="checkbox" checked={ads} onChange={(event) => setAds(event.target.checked)} className="mt-1" /><span><strong>Publicidade</strong><br /><span className="text-slate-400">Permite carregar serviços de anúncios do Google.</span></span></label>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={acceptAll} className="bg-yellow-500 text-slate-950 hover:bg-yellow-400">Aceitar tudo</Button>
          <Button onClick={rejectAll} variant="outline" className="border-slate-500 bg-transparent text-white hover:bg-slate-800">Recusar não essenciais</Button>
          {open && consent ? <Button onClick={() => save({ analytics, ads })} variant="ghost" className="text-white hover:bg-slate-800">Salvar preferências</Button> : <Button onClick={() => setOpen(true)} variant="ghost" className="text-white hover:bg-slate-800">Configurar</Button>}
          <a href="/politica-de-privacidade" className="self-center text-sm text-slate-300 underline">Política de privacidade</a>
        </div>
      </div>
    </div>
  );
};

export default ConsentManager;
