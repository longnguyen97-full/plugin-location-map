// libraries
import React from "react";

class ButtonCopyShortCode extends React.Component {
  constructor(props) {
    super(props);

    this.state = { copySuccess: this.props.text };
  }

  unsecuredCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      this.setState({ copySuccess: "Copied!" });
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };

  /**
   * navigator clipboard require https, we will use 2 approads secure and insecure
   */
  copyToClipboard = () => {
    const text = document.querySelector(".lmap_shortcode").textContent;
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.setState({ copySuccess: "Copied!" });
    } else {
      this.unsecuredCopyToClipboard(text);
    }
  };

  render() {
    return (
      <div>
        <code className="lmap_shortcode">[lmap_shortcode]</code>&nbsp;
        <button type="button" className="button button-primary" onClick={this.copyToClipboard}>
            {this.state.copySuccess}
        </button>
      </div>
    );
  }
}

export default ButtonCopyShortCode;
