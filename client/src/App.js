import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import Navigation from "./components/Navigation/Navigation";
import FooterArea from "./screens/HomeScreen/FooterArea";
import ProductScreen from "./screens/ProductScreen/ProductScreen";
import Shop from "./components/Shop/Shop";
import ScrollToTop from "./components/ScrollToTop";
import LoginScreen from "./screens/Auth/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen/RegisterScreen";
import UserProfile from "./screens/Profile/User/UserProfile";
import CartScreen from "./screens/CartScreen/CartScreen";
import ShippingScreen from "./screens/Shipping/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen/OrderScreen";
import UserEditScreen from "./screens/Profile/Admin/UserEditScreen";
import ProductEditScreen from "./screens/Profile/Admin/ProductEdit/ProductEditScreen";
import ProductCreateScreen from "./screens/Profile/Admin/ProductCreate/ProductCreateScreen";
import RequestDescriptionScreen from "./screens/RequestScreen/RequestDescriptionScreen";
import NewsFeed from "./screens/guest/Newsfeed";
import News from "./screens/guest/News";
import AddNews from "./screens/Profile/NewsManager/AddNews";
import ShopScreen from "./screens/ShopScreen/MainSection";
import MyShopScreen from "./screens/Profile/Admin/ProductList/MainSection";
import AllShops from "./screens/AllShopsScreen/AllShops";
import CreateShop from "./screens/ShopScreen/AddShopScreen/AddShop";
import CreateComplin from "./screens/ComplainCreateScreen/ComplainCreate";

import { ChatAiWidget } from "@sendbird/chat-ai-widget";
import "@sendbird/chat-ai-widget/dist/style.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navigation />
      <main>
        <Routes>
          <Route path="/shipping" element={<ShippingScreen/>}></Route>
          <Route path="/order/:id" element={<OrderScreen/>}></Route>
          <Route path="/payment" element={<PaymentScreen/>}></Route>
          <Route path="/product/:id" element={<ProductScreen/>}></Route>
          <Route path="/placeorder" element={<PlaceOrderScreen/>}></Route>
          <Route path="/shop" element={<Shop/>}></Route>
          <Route path="/login" element={<LoginScreen/>}></Route>
          <Route path="/register" element={<RegisterScreen/>}></Route>
          <Route path="/userProfile" element={<UserProfile/>}></Route>
          <Route path="/cart" element={<CartScreen/>} />
          <Route path="/admin/user/:id/edit" element={<UserEditScreen/>} />
          <Route path="/request/:id" element={<RequestDescriptionScreen/>} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen/>} />
          <Route path="/admin/product/create" element={<ProductCreateScreen/>} />
          <Route path="/news" element={<NewsFeed/>} />
          <Route path="/news/:id" element={<News/>} />
          <Route path="/news/add" element={<AddNews/>} />
          <Route path="/shop/:id" element={<ShopScreen/>} />
          <Route path="/allshop" element={<AllShops/>} />
          <Route path="/myshop/:id" element={<MyShopScreen/>} />
          <Route path="/myshop/create/:id" element={<CreateShop/>} />
          <Route path="/complaint/add/:id" element={<CreateComplin/>} />
          <Route path="/" element={<HomeScreen/>} exact></Route>
        </Routes>
        <ChatAiWidget
            applicationId="0ACAF912-3DFF-4C62-AF09-6D54B8A1B695" // Your Sendbird Application ID
            botId="onboarding_bot" // Your Bot ID
        />
      </main>
      <FooterArea></FooterArea>
    </Router>
  );
}

export default App;
