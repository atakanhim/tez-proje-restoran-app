import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Header, Home, Loading, Login } from "./components";
//import axios
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
//import setCategories
import { setCategories } from "./store/slices/restoranSlice";
import { getCategories } from "./api/api";
import { Categories, Products, Dashboard } from "./components/Admin";
import { ChefScreen } from "./components/Chef";

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
    }
    console.log("user", user);
  }, [user]);

  const dispatch = useDispatch();
  // axios get req
  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = async () => {
    const response = await getCategories();
    dispatch(setCategories(response));
  };

  const adminRoutes = [
    {
      path: "admin/categories",
      element: <Categories />,
    },
    {
      path: "admin/products",
      element: <Products />,
    },
    {
      path: "admin/dashboard",
      element: <Dashboard />,
    },
  ];
  const chefRoutes = [
    {
      path: "chef/chefscreen",
      element: <ChefScreen />,
    },
  ];

  return (
    <AnimatePresence exitBeforeEnter>
      <div className=" w-screen bg-slate-100 gap-2  flex  flex-col  text-base font-bold  ">
        {masaNo ? (
          <>
            <Header />
            <Routes>
              <Route path="/*" element={<Home />} />
            </Routes>
          </>
        ) : (
          <>
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
