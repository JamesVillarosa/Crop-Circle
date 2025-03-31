import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportList from "./ReportsList";
import Footer from "../../../components/Footer";
import '../../styles/ReportList.css';

function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const yearsRange = Array.from({ length: 5 }, (_, index) => currentYear - index);

  useEffect(() => {
    const fetchMonthlyOrder = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/completedOrders/${selectedMonth}/${selectedYear}`);
        setOrders(aggregateOrders(response.data));
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (selectedMonth && selectedYear) {
      fetchMonthlyOrder();
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchAnnualOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/completedOrders/year/${selectedYear}`);
        setOrders(aggregateOrders(response.data));
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear && !selectedMonth && !selectedWeek) {
      fetchAnnualOrder();
    }
  }, [selectedYear, selectedMonth, selectedWeek]);

  useEffect(() => {
    const fetchWeeklyOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/completedOrders/week/${selectedWeek}/${selectedYear}`);
        setOrders(aggregateOrders(response.data));
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedWeek && selectedYear) {
      fetchWeeklyOrder();
    }
  }, [selectedWeek, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedWeek("");  
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setSelectedMonth("");  
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const weekNumber = getWeekNumber(date);
    setSelectedWeek(weekNumber);
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  };

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  const aggregateOrders = (orders) => {
    const aggregated = orders.reduce((acc, order) => {
      const { productId, name, price, description, type, imageUrl } = order;
      if (!acc[productId]) {
        acc[productId] = {
          _id: productId,
          name,
          price,
          description,
          type,
          imageUrl,
          totalQuantity: 0,
          totalSales: 0,
        };
      }
      acc[productId].totalQuantity += order.addedQuantity;
      acc[productId].totalSales += order.price * order.addedQuantity;
      return acc;
    }, {});

    return Object.values(aggregated);
  };

  return (
    <div className="App">
      <h1 className="report-title">REPORTS</h1>
      <main>
        <div className="report-dropdowns">
          <select className="report-custom-dropdown" value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select className="report-custom-dropdown" value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            {yearsRange.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select className="report-custom-dropdown" value={selectedWeek} onChange={handleWeekChange}>
            <option value="">Select Week</option>
            {Array.from({ length: 52 }, (_, index) => (
              <option key={index} value={index + 1}>{`Week ${index + 1}`}</option>
            ))}
          </select>
        </div>
        <br />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ReportList orders={orders} handleDateChange={handleDateChange} selectedDate={selectedDate} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Reports;