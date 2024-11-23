import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom"
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { getUserDetails } from "../../actions/userAction";

const ComplainCreateScreen = ({ history }) => {
  const { id } = useParams();
  const [shop, setShop] = useState("");
  const [user1, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const userDetail = useSelector((state) => state.userDetail);
  const {  user } = userDetail;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!user || !user.name) {
      dispatch(getUserDetails("profile"));
    } else {
      setUser(user._id);
    }
  }, [history, userInfo, dispatch, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:3001/api/complain/", {
        shop: id,
        user: user1,
        description,
      });
      setSuccess(true);
    } catch (error) {
      setError(error.response.data.error || "Something went wrong");
    }

    setLoading(false);
  };

  console.log(user1)

  return (
    <Container>
      <h1>Add Complaint</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Complaint added successfully</Message>}
      <Link to={`/shop/${id}`} className="btn btn-primary">Go Back</Link>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter complaint description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <br/>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Container>
  );
};

export default ComplainCreateScreen;
