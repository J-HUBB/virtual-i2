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
  const cardClasses = isSelected ? "plan__card--active" : "plan__card";

  return (
      
      <>
      <div
        className={cardClasses}
        onClick={() => onSelect(id)} // Attach the handler directly
      >
        {/* Radio button / selection indicator goes here */}
        {/* <input type="radio" checked={isSelected} readOnly /> */}

        {/* Plan details  */}
        {/* <h3>{title}</h3>
        <p><strong>{price}</strong></p>
        <small>{trial}</small> */}


      <div className="plan__card plan__card--active" data-plan-id="yearly">
        <div className="plan__card--circle">
          <div className="plan__card--dot"></div>
        </div>
        <div className="plan__card--content">
          <div className="plan__card--title">{title}</div>
          <div className="plan__card--price">{price}</div>
          <div className="plan__card--text">{trial}</div>
        </div>
      </div>


      </div>
      <div className="plan__card--separator">
      <div className="plan__separator">or</div>
      </div> 

    </>
  );
};

export default PlanCard;
