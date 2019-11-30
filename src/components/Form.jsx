import React from 'react';
import { Row} from 'react-bootstrap';



const Form = (props) => {
  return (
    <Row className="text-right">
    <form onSubmit={(event) => props.handleUserFormSubmit(event)}> 
        <label>
          <input
            className="form-control"
            name="username"
            type="text"
            placeholder="Github Username"
            required
            value={props.formData.username}
            onChange={props.handleFormChange}
          />
        </label>
        <span>   </span>
          <input
            type="submit"
            value="Submit"
                  className="btn btn-light"
                  style={{ backgroundColor: "#D0F0C0" }}
                  
          />

    </form>
    </Row>
  )};

export default Form;
