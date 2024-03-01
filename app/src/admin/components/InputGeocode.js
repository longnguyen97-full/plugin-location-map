import Form from "react-bootstrap/Form";

function InputGeocode(props) {
  return (
    <>
      <div className={"mt-3 " + props.id + " " + props.wrapClassName}>
        <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
        <Form.Control
          type={props.type}
          id={props.id}
          name={props.name}
          aria-describedby={props.label}
          value={props.value}
          onChange={props.onChange}
          className={props.className}
        />
      </div>
      {props.errorMessage && (
        <div className="alert alert-danger" role="alert">
          {props.errorMessage}
        </div>
      )}
    </>
  );
}

export default InputGeocode;
