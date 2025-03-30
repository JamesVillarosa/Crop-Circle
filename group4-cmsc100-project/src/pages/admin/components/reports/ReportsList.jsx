import React from "react";
import '../../styles/ReportList.css';
import ReportLogo from '../../../../assets/illus/illus1.png';
import Calendar from 'react-calendar';

const ReportList = ({ orders, handleDateChange, selectedDate }) => {
  const totalAmount = orders.reduce((sum, order) => sum + (order.totalSales || 0), 0);
  const totalQuantity = orders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0);

  const foodTypeLabels = {
    1: "Staple",
    2: "Fruits and Vegetables",
    3: "Livestock",
    4: "Seafood",
    5: "Others",
    All: "All Types",
  };

  return (
    <div>
      <div className="report-header-container">
        <img src={ReportLogo} className="report-header-logo" alt="Report Logo" />
        <div className="report-header-info">
          <h3 className="report-header-text-1">Total Amount Sales</h3>
          <h1 className="report-header-text-2">₱{totalAmount.toFixed(2)}</h1>
        </div>
        <div className="report-header-info">
          <h3 className="report-header-text-1">Total Quantity Sold</h3>
          <h1 className="report-header-text-2">{totalQuantity}</h1>
        </div>
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
      </div>
      <br /> 
      <h2 className="report-title">Products Sold</h2>
      <div className="report-orders">
        {orders.map((order) => (
          <div key={order._id} className="report-order">
            <img src={order.imageUrl} alt={order.name} className="report-product-image" />
            <div className="report-product-details">
              <h3 className="report-productname">{order.name}</h3>
              <p className="report-productprice">₱{order.price?.toFixed(2)}</p>
              <p className="report-desc">{order.description}</p>
              <p className="report-foodtype">{foodTypeLabels[order.type]}</p>
              <p className="report-foodquantity">Total Quantity: {order.totalQuantity}</p>
              <p className="report-foodsales">Total Sales: ₱{order.totalSales?.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
