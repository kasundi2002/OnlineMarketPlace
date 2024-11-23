import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Container from "../../../../components/Container";
import classes from "./MainSection.module.css";
import trolly from "../../../ShopScreen/images/xhero-banner.png.pagespeed.ic.Da3KtaVoQv.webp";
import "react-multi-carousel/lib/styles.css";
import editImg from "./icons8-edit.svg";

const MainSection = () => {

  const { id } = useParams();
  const [shop, setShop] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const getShop = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/api/shops/seller/${id}`);
          setShop(response.data);
          
          setFormData({
            title: response.data.title,
            description: response.data.description
          });
      } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 404) {
              console.error('unot found.');
          } else {
              console.error(error.response?.data?.message || 'An error occurred');
          }
      }
  };

  useEffect(() => {
      getShop();
  }, []);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/api/shops/${shop._id}`, formData);
      console.log('Data updated successfully:', response.data);
      // Optionally, you can update the local state with the updated data
      setShop(response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };  

  return (
    <>
      <div className={classes.heroBanner}>
        <Container>
          <div className={classes.content}>
            <img className={classes.imageFluid} src={trolly} alt="Trolly" />
            <div className={classes.intro}>
              <button className={`btn btn-link ${classes.profile_butt}`}><img
                src={shop.logo}
                className={`rounded-circle shadow-4 ${classes.pp}`}
                style={{ width: 150 }}
                alt="Avatar"
              /></button>
              <form onSubmit={handleSubmit}>
              <h4><input name='title' type='text' value={formData.title} placeholder={shop.title} onChange={handleInputChange}/></h4>
              <h1>{shop.name}</h1>
              <p><textarea name='description' rows="4" cols="60" value={formData.description} placeholder={shop.description} onChange={handleInputChange}/></p>
              <div className={classes.butt}><button type='submit'>Update Now</button></div>
              </form>
            </div>
          </div>
        </Container>
      </div>
      <h3>Your Products Gose Here</h3>
    </>
  );
};

export default MainSection;
