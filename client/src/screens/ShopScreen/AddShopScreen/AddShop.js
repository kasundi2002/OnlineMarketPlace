import React, { useState } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Grid } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import authAxios from "../../../utils/authAxios";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../../../actions/userAction";
// import { toast } from "react-toastify";

export default function AddShop() {
  const { id } = useParams();
  const sid = id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sid: sid,
    name: '',
    description: '',
    logo: '',
    category: [],
  });


  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
        setFormData((prevData) => ({ ...prevData, sid: sid }));
      const result = await authAxios.post(`http://localhost:3001/api/shops/`, formData);
      const updatedData = {brandName: formData.name}
      dispatch(updateUserProfile({ id: sid,  brandName: formData.name}));
      if (result) {
        // console.success(result.data.message);
        navigate('/userProfile');
      }
      // getUsers();
    } catch (error) {
      //console.log(error);
      console.error(error.response.data.message);
    }
  };



  const handleCreate = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  return (<>
    <div className="max-w-md mx-auto container">
      <h1 className="text-3xl text-center mb-6">Create Shop</h1>
      <Grid item xs={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Shop Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleCreate('name', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Logo Link"
          variant="outlined"
          value={formData.logo}
          onChange={(e) => handleCreate('logo', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={4}
          label="Description"
          variant="outlined"
          value={formData.description}
          onChange={(e) => handleCreate('description', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            multiple 
            value={formData.category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Games">Games</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Men">Men Fashions</MenuItem>
            <MenuItem value="Women">Women Fashions</MenuItem>
            <MenuItem value="Baby">Baby</MenuItem>
            <MenuItem value="Automobile">Automobile</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      

      <br></br>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => handleSubmit()} style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '8px' }} variant="contained" fullWidth>
            Create Shop
        </Button>
        <div style={{ width: '8px' }}></div> {/* This adds space between buttons */}
        <Button style={{ backgroundColor: '#f44336', color: 'white' }} variant="contained" fullWidth component={Link} to="/userProfile">
          Cancel
        </Button>
      </div>
    </div>
  </>
  );
}
