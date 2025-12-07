// components/PlanCard.tsx (New File)

interface PlanCardProps {
  id: string;
  title: string;
  price: string;
  trial: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  title,
  price,
  trial,
  isSelected,
  onSelect,
}) => {
  // Use a class name or style based on the `isSelected` prop
  const cardClasses = `plan__card ${isSelected ? "plan__card--active" : ""}`;
  const buttonCtaSwitch = `plan__card ${isSelected ? "btn" : "plan__disclaimer"}`
  return (
    <div className={cardClasses} data-plan-id={id} onClick={() => onSelect(id)}>
      <div className="plan__card--circle">
        {isSelected && <div className="plan__card--dot" />}
      </div>
      <div className="plan__card--content">
        <div className="plan__card--title">{title}</div>
        <div className="plan__card--price">{price}</div>
        <div className="plan__card--text">{trial}</div>
      </div>
    </div>
  );
};

export default PlanCard;
