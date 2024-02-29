// components
import ButtonCopyShortCode from "./ButtonCopyShortCode";

function Header() {
  return (
    <div>
      <h2 className="mb-3">Location Map Settings</h2>
      <h3>Get shortcode</h3>
      <p>Place the below shortcode on anywhere you need to display the map</p>
      <ButtonCopyShortCode
        saveFrom={"lmap_shortcode"}
        text="Copy"
      ></ButtonCopyShortCode>
    </div>
  );
}

export default Header;
