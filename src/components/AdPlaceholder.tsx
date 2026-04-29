interface AdPlaceholderProps {
  id: string;
  className?: string;
}

const AdPlaceholder = ({ id, className = "" }: AdPlaceholderProps) => {
  return (
    <div 
      id={id} 
      className={`ad-container ${className}`}
      role="complementary"
      aria-label="Espaço publicitário"
    >
      <span className="text-xs">Espaço para Anúncio</span>
    </div>
  );
};

export default AdPlaceholder;
