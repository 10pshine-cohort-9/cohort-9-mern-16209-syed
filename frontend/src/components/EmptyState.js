import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({
  icon,
  title,
  message,
  showButton,
  buttonText,
  onButtonClick,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/editor");
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>

      {showButton && (
        <button
          type="button"
          className="btn-primary empty-button"
          onClick={handleClick}
        >
          {buttonText || "Create First Note"}
        </button>
      )}
    </div>
  );
}