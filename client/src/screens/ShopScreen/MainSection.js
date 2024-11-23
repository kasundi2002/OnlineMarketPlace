import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import Container from "../../components/Container";
import classes from "./MainSection.module.css";
import trolly from "./images/xhero-banner.png.pagespeed.ic.Da3KtaVoQv.webp";
import "react-multi-carousel/lib/styles.css";
import Shop from "./Shop/Shop";


const MainSection = () => {

  const { id } = useParams();
  const [shop, setShop] = useState({});

  const getShop = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/api/shops/${id}`);
          setShop(response.data);
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



  return (
    <>
      <div className={classes.heroBanner}>
        <Container>
          <div className={classes.content}>
            <img className={classes.imageFluid} src={trolly} alt="Trolly" />
            <div className={classes.intro}>
              <img
                src={shop.logo}
                className="rounded-circle shadow-4"
                style={{ width: 150 }}
                alt="Avatar"
              />
              <h4>{shop.title}</h4>
              <h1>{shop.name}</h1>
              <p>{shop.description}</p>
              <a href="/shop">Browse Now</a>
            </div>
            <Link to={`/complaint/add/${id}`} className={`btn btn-outline-danger btn-rounded ${classes.complaint}`}>Add Complaint</Link>
          </div>
        </Container>
      </div>
      <h3>Our Products</h3>
      <Shop />
    </>
  );
};

export default MainSection;
