// admin/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Orders from "./pages/Orders";
import TestSocket from "./pages/TestSocket";

import Add from "./pages/Add";
import List from "./pages/List";
import MenuList from "./pages/MenuList";
import MenuAdd from "./pages/MenuAdd";
import Kitchen from "./pages/Kitchen";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAdminAuth } from "./context/AdminAuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { token } = useAdminAuth();

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {token && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <ToastContainer />

        {token && <Navbar />}

        <div className="p-4 flex-1">

          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Add />
                </ProtectedRoute>
              }
            />

<Route path="/test-socket" element={<TestSocket />} />

            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <MenuList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu/add"
              element={
                <ProtectedRoute>
                  <MenuAdd />
                </ProtectedRoute>
              }
            />

            <Route
              path="/kitchen"
              element={
                <ProtectedRoute>
                  <Kitchen />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
