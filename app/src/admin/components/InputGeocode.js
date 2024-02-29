import Form from "react-bootstrap/Form";

function InputGeocode(props) {
  return (
    <div className={"mt-3 " + props.id}>
      <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
      <Form.Control
        type="text"
        id={props.id}
        name={props.name}
        aria-describedby={props.label}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}

export default InputGeocode;
