import React, { useEffect, useState } from "react";
import { FETCH_ORDERS_ANALYSIS } from "../redux/features/product/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import "../CSS/Dashboard.css";
import { Select } from "antd";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const orderanalysis = useSelector((state) => state.order.orderAnalysis);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearOptions = Array.from({ length: 8 }, (_, index) => {
    const year = currentYear - index;
    return {
      label: year.toString(),
      value: year,
    };
  });

  useEffect(() => {
    dispatch(FETCH_ORDERS_ANALYSIS({ year: selectedYear }));
  }, [dispatch, selectedYear]);

  const data =
    Object.keys(orderanalysis).length > 0
      ? [
      {
        name: "Jan",
        total: orderanalysis.January.total,
        totalDiscount: orderanalysis.January.totalDiscount,
        totalRevenue: orderanalysis.January.totalRevenue,
        totalsales: orderanalysis.January.totalsales,
        totalH: (orderanalysis.January.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.January.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.January.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Feb",
        total: orderanalysis.February.total,
        totalDiscount: orderanalysis.February.totalDiscount,
        totalRevenue: orderanalysis.February.totalRevenue,
        totalsales: orderanalysis.February.totalsales,
        totalH: (orderanalysis.February.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.February.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.February.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Mar",
        total: orderanalysis.March.total,
        totalDiscount: orderanalysis.March.totalDiscount,
        totalRevenue: orderanalysis.March.totalRevenue,
        totalsales: orderanalysis.March.totalsales,
        totalH: (orderanalysis.March.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.March.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.March.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Apr",
        total: orderanalysis.April.total,
        totalDiscount: orderanalysis.April.totalDiscount,
        totalRevenue: orderanalysis.April.totalRevenue,
        totalsales: orderanalysis.April.totalsales,
        totalH: (orderanalysis.April.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.April.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.April.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "May",
        total: orderanalysis.May.total,
        totalDiscount: orderanalysis.May.totalDiscount,
        totalRevenue: orderanalysis.May.totalRevenue,
        totalsales: orderanalysis.May.totalsales,
        totalH: (orderanalysis.May.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.May.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.May.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Jun",
        total: orderanalysis.June.total,
        totalDiscount: orderanalysis.June.totalDiscount,
        totalRevenue: orderanalysis.June.totalRevenue,
        totalsales: orderanalysis.June.totalsales,
        totalH: (orderanalysis.June.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.June.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.June.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "July",

        total: orderanalysis.July.total,
        totalDiscount: orderanalysis.July.totalDiscount,
        totalRevenue: orderanalysis.July.totalRevenue,
        totalsales: orderanalysis.July.totalsales,
        totalH: (orderanalysis.July.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.July.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.July.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Aug",
        total: orderanalysis.August.total,
        totalDiscount: orderanalysis.August.totalDiscount,
        totalRevenue: orderanalysis.August.totalRevenue,
        totalsales: orderanalysis.August.totalsales,
        totalH: (orderanalysis.August.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.August.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.August.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Sept",
        total: orderanalysis.September.total,
        totalDiscount: orderanalysis.September.totalDiscount,
        totalRevenue: orderanalysis.September.totalRevenue,
        totalsales: orderanalysis.September.totalsales,
        totalH: (orderanalysis.September.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.September.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.September.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Oct",
        total: orderanalysis.October.total,
        totalDiscount: orderanalysis.October.totalDiscount,
        totalRevenue: orderanalysis.October.totalRevenue,
        totalsales: orderanalysis.October.totalsales,
        totalH: (orderanalysis.October.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.October.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.October.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Nov",
        total: orderanalysis.November.total,
        totalDiscount: orderanalysis.November.totalDiscount,
        totalRevenue: orderanalysis.November.totalRevenue,
        totalsales: orderanalysis.November.totalsales,
        totalH: (orderanalysis.November.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.November.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.November.totalRevenue * 100) / orderanalysis.max,
      },
      {
        name: "Dec",
        total: orderanalysis.December.total,
        totalDiscount: orderanalysis.December.totalDiscount,
        totalRevenue: orderanalysis.December.totalRevenue,
        totalsales: orderanalysis.December.totalsales,
        totalH: (orderanalysis.December.total * 100) / orderanalysis.max,
        totalDiscountH:
          (orderanalysis.December.totalDiscount * 100) / orderanalysis.max,

        totalRevenueH:
          (orderanalysis.December.totalRevenue * 100) / orderanalysis.max,
      },
        ]
      : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-toolbar">
        <h3>Dashboard</h3>
        <Select
          value={selectedYear}
          options={yearOptions}
          onChange={setSelectedYear}
          className="dashboard-year-select"
        />
      </div>
      <div className="row admin-section-heading">
        <h3>Income Statics</h3>
      </div>
      <div className="admin-chart-card admin-chart-card-large">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width={42} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Origianl Total Price" fill="#8884d8" />
            <Bar dataKey="totalRevenue" name="Total Revenue " fill="#82ca9d" />
            <Bar dataKey="totalDiscount" name="Total Discount" fill="#00d084" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Income AreaChart */}
      <div className="admin-chart-card">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis width={42} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
            <Area
              type="monotone"
              dataKey="totalDiscount"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="row admin-section-heading">
        <h3>Total Sales</h3>
      </div>
      <div className="admin-chart-card">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width={42} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalsales" name=" Total sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="admin-chart-card">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUvSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis width={42} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="totalsales"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUvSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
