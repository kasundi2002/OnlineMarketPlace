import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Hit from "../../../components/Hit/Hit.js";
import {
  ShopContent,
  SideBar,
  SideBarCategories,
  CategoryHeading,
  CategoryList,
  CategoryListItem,
  SidebarFilters,
  SidebarFilterHeading,
  ProductFilter,
  FilterHeading,
  MainContent,
  FilterBar,
  ProductsContainer,
  PageNav,
  SearchAndFilters,
  MobileFilterBar,
  MobileProducts,
  MobileFilterButton,
  MobileFilterOverlay,
  CloseOverlay,
} from "./Shop.elements.js";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  Pagination,
  RefinementList,
  SortBy,
} from "react-instantsearch-dom";
import CustomRangeSlider from "./RangeSlider";

const searchClient = algoliasearch(
  "3WLZNWFJJD",
  "63ae3131f6b1417cf1596df68b07cd2f"
);

const Shop = () => {
  let mobile = false;

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



  if (window.screen.width < 1000) {
    mobile = true;
  } else {
    mobile = false;
  }

  const productAll = useSelector((state) => state.productAll);
  const { loading, error } = productAll;

  const overlayHandler = () => {
    if (document.getElementById("overlay").style.display === "block") {
      document.getElementById("overlay").style.display = "none";
    } else {
      document.getElementById("overlay").style.display = "block";
    }
  };

  return (
    <>
      <InstantSearch indexName="ecommercial_app" searchClient={searchClient}>
        {mobile ? (
          <>
            <SearchAndFilters>
              <SearchBox />
              <MobileFilterBar>
                <MobileFilterButton onClick={overlayHandler}>
                  Category Filters
                </MobileFilterButton>
                <MobileFilterOverlay id="overlay">
                  <CloseOverlay onClick={overlayHandler} />
                  <SideBarCategories>
                    <CategoryHeading>Browse Categories</CategoryHeading>
                    <CategoryList>
                      <CategoryListItem>
                        <RefinementList attribute="category" />
                      </CategoryListItem>
                    </CategoryList>
                  </SideBarCategories>
                  <SidebarFilters>
                    <SidebarFilterHeading>Product Filters</SidebarFilterHeading>
                    <ProductFilter style={{ display: 'none' }}>
                      <CategoryList>
                        <CategoryListItem>
                          <RefinementList
                            attribute="brand"
                            defaultRefinement={shop.name} // Hardcoded selection
                          />
                        </CategoryListItem>
                      </CategoryList>
                    </ProductFilter>
                    <ProductFilter>
                      <FilterHeading>Price</FilterHeading>
                      <CategoryList>
                        <CategoryListItem>
                          <CustomRangeSlider attribute="price" />
                        </CategoryListItem>
                      </CategoryList>
                    </ProductFilter>
                  </SidebarFilters>
                </MobileFilterOverlay>
                
              </MobileFilterBar>
            </SearchAndFilters>
            <MobileProducts>
              {loading ? (
                <Loader />
              ) : error ? (
                <Message>{error}</Message>
              ) : (
                <>
                  <Configure hitsPerPage={8} />
                  <Hits hitComponent={Hit} />
                </>
              )}
              <PageNav>
                <Stack spacing={2}>
                  <Pagination />
                </Stack>
              </PageNav>
            </MobileProducts>
          </>
        ) : (
          <>
            <ShopContent>
              <SideBar>
                <SideBarCategories>
                  <CategoryHeading>Browse Categories</CategoryHeading>
                  <CategoryList>
                    <CategoryListItem>
                      <RefinementList attribute="category" />
                    </CategoryListItem>
                  </CategoryList>
                </SideBarCategories>
                <SidebarFilters>
                  <SidebarFilterHeading>Product Filters</SidebarFilterHeading>
                  <ProductFilter style={{ display: 'none' }}>
                    <FilterHeading>Brand</FilterHeading>
                    <CategoryList>
                      <CategoryListItem>
                        <RefinementList
                          attribute="brand"
                          defaultRefinement={shop.name} // Hardcoded selection
                        />
                      </CategoryListItem>
                    </CategoryList>
                  </ProductFilter>
                  <ProductFilter>
                    <FilterHeading>Price</FilterHeading>
                    <CategoryList>
                      <CategoryListItem>
                        <CustomRangeSlider attribute="price" />
                      </CategoryListItem>
                    </CategoryList>
                  </ProductFilter>
                </SidebarFilters>
              </SideBar>
              <MainContent>
                <FilterBar>
                  
                  <SearchBox className="w-50" />
                </FilterBar>
                <ProductsContainer>
                  {loading ? (
                    <Loader />
                  ) : error ? (
                    <Message>{error}</Message>
                  ) : (
                    <>
                      <Configure hitsPerPage={12} />
                      <Hits hitComponent={Hit} />
                    </>
                  )}
                  <PageNav>
                    <Stack spacing={2}>
                      <Pagination />
                    </Stack>
                  </PageNav>
                </ProductsContainer>
              </MainContent>
            </ShopContent>
          </>
        )}
      </InstantSearch>
    </>
  );
};

export default Shop;
