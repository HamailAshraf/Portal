import { useState } from "react"
import './DropDown.css';

//import { useSearchParams } from "react-router-dom"

export function DropDown() {
    const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown-btn" onClick={(e) => setIsActive(!isActive)}>Choose One</div>
        {isActive && (
        <div className="dropdown-content">
                <div className="dropdown-item">
                    Item1
                </div>
                <div className="dropdown-item">
                    Item2
                </div>
        </div>
        )}
    </div>
  )
}

