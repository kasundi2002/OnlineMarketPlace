import classes from "./ShopCard.module.css";
import { Link } from "react-router-dom";
import "bootstrap";
const ShopCard = ({ shop }) => {

  return (
    // <div className={classes.container}>
    //   <Link to={`/shops/${shop._id}`}>
    //     <img src={shop.image} alt="shop" />
    //   </Link>
    //   <div className={classes.content}>
    //     <p className={classes.category}>{shop.category}</p>
    //     <a href="/">{shop.name}</a>
    //     <p className={classes.price}>${shop.price}</p>
    //   </div>
    // </div>

    <div >
        <Link to={`/shop/${shop._id}`}>
        <div className={`card ${classes.testimonial_card}`}>
            <div className={classes.card_up} style={{ backgroundColor: "#9d789b" }} />
            <div className={`${classes.avatar} mx-auto bg-white`}>
            <img
                src={shop.logo}
                className="rounded-circle img-fluid"
            />
            </div>
            <div className="card-body">
            <h4 className="mb-4">{shop.name}</h4>
            <hr />
            <p className="dark-grey-text mt-4">
                <i className="fas fa-quote-left pe-2" />
                {shop.title}
            </p>
            </div>
        </div>
        </Link>
    </div>

    
    
  );
};

export default ShopCard;
