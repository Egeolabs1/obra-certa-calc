interface AdPlaceholderProps {
  id: string;
  className?: string;
}

const AdPlaceholder = ({ id, className = "" }: AdPlaceholderProps) => {
  // Do not reserve empty areas or invite clicks before a real, policy-compliant
  // ad unit is configured. This keeps the product useful independently of ads.
  if (import.meta.env.VITE_ENABLE_AD_SLOTS !== "true") return null;

  return <div id={id} className={className} aria-hidden="true" />;
};

export default AdPlaceholder;
