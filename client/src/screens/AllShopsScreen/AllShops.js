import Container from "../../components/Container";
import { Box, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import classes from "./AllShops.module.css";
import ShopCard from "../../components/ShopCard/ShopCard";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import axios from "axios";

const AllShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        function getShops() {
        axios.get("http://localhost:3001/api/shops/").then((res) => {
            setShops(res.data);
            setLoading(false);
        }).catch((err) => {
            console.error("Error fetching shops:", err.message);
            // Handle errors more gracefully (e.g., display an error message)
        });
        }
        getShops();
    }, []);

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };

    const filteredShops = shops.filter(shop =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Container>
      <div className={classes.intro}>
        <p>Find your shop and start shoping right now.</p>
        <h2>SHOPS FOR YOU</h2>
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: 2,
        }}
      >
        <InputBase
          placeholder="Search…"
          sx={{ ml: 1, width: 200, border: '1px solid #ccc', borderRadius: 3, paddingLeft: 1 }}
          onChange={handleSearchChange}
        />
        <IconButton sx={{ p: '10px', marginRight: 2 }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <div className={classes.showcase}>
          {filteredShops.map((shops) => (
            <ShopCard key={shops._id} shop={shops} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default AllShops;
