import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading, Login } from "./components";
//import axios
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
//import setCategories
import {
  setCategories,
  setProducts,
  setMenus,
  setOrders,
} from "./store/slices/restoranSlice";
import {
  getCategoriesFromDB,
  getProductsFromDB,
  getMenusFromDB,
  getOrdersFromDB,
} from "./api/api";
import {
  Categories,
  Products,
  Dashboard,
  AdminHeader,
  CategoryUpdate,
  ProductUpdate,
  Menus,
  MenuUpdate,
} from "./components/Admin";
import { ChefScreen, ChefHeader, OrderDetails } from "./components/Chef";
import { Cart, Footer, Home, Orders } from "./components/Customers";
import "alertifyjs/build/css/alertify.css";
import { AddToCart, AddToCartForMenus } from "./components/CustomCarts";
import OrderControl from "./components/Chef/OrderControl/OrderControl";

const App = () => {
  const { user, masaNo } = useSelector((state) => state.restoran);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChef, setIsChef] = useState(false);

  useEffect(() => {
    if (user) {
      switch (user) {
        case "admin":
          setIsAdmin(true);
          setIsChef(false);
          break;
        case "chef":
          setIsChef(true);
          setIsAdmin(false);
          break;
        default:
          setIsAdmin(false);
          setIsChef(false);
          break;
      }
    } else {
      setIsAdmin(false);
      setIsChef(false);
    }
    console.log("user", user);
  }, [user]);

  const dispatch = useDispatch();
  // axios get req
  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const response = await getCategoriesFromDB();
    dispatch(setCategories(response));
    const respons2 = await getProductsFromDB();
    dispatch(setProducts(respons2));
    const respons3 = await getMenusFromDB();
    dispatch(setMenus(respons3));
    const respons4 = await getOrdersFromDB();
    dispatch(setOrders(respons4));
  };

  const adminRoutes = [
    {
      path: "admin/categories",
      element: <Categories />,
    },

    {
      path: "admin/category-update/:id",
      element: <CategoryUpdate />,
    },

    {
      path: "admin/products",
      element: <Products />,
    },
    {
      path: "/admin/menus",
      element: <Menus />,
    },
    {
      path: "admin/menu-update/:id",
      element: <MenuUpdate />,
    },
    {
      path: "admin/product-update/:id",
      element: <ProductUpdate />,
    },
    {
      path: "admin/dashboard/",
      element: <Dashboard />,
    },
    {
      path: "admin/*",
      element: <Dashboard />,
    },
  ];
  const chefRoutes = [
    {
      path: "chef/chefscreen",
      element: <ChefScreen />,
    },
    {
      path: "chef/orders",
      element: <OrderControl />,
    },
    {
      path: "chef/orderdetails/:id",
      element: <OrderDetails />,
    },
    {
      path: "chef/*",
      element: <ChefScreen />,
    },
  ];

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-full  gap-2  flex  flex-col  text-base font-bold  ">
        {masaNo ? (
          <>
            <Routes>
              <Route path="/*" element={<Home />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/add-to-cart/:id" element={<AddToCart />} />
              <Route
                path="/add-to-cart-for-menus/:id"
                element={<AddToCartForMenus />}
              />
            </Routes>
            <Footer />
          </>
        ) : (
          <>
            {/* admin özel header olacak */}
            {isAdmin && <AdminHeader />}
            {isChef && <ChefHeader />}
            <Routes>
              <Route path="/*" element={<Login />} />
              <Route path="/restoran/table/*" element={<Loading />} />
              {isAdmin &&
                adminRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              {isChef &&
                chefRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
            </Routes>
          </>
        )}
      </div>
    </AnimatePresence>
  );
};

export default App;
