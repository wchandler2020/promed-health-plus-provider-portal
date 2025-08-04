import React from "react";
import Navbar from "../navbar/Navbar";
import Orders from "./orders/Orders";
import Documents from "./documemts/Documents";
import Patients from "./patient/Patient";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-10 px-4 sm:px-6 lg:px-12 grid gap-6 
                grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-full">
          <Patients />
        </div>
        <div className="h-full">
          <Documents />
        </div>
        <div className="h-full">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
