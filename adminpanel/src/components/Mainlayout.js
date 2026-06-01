import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ProductOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  TagFilled,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

import { Layout, Menu, Button, Grid } from "antd";
import "../CSS/Mainlayout.css";
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const Mainlayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <>
      <Layout className="admin-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={isMobile ? 0 : 80}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
          className="admin-sider"
        >
          {collapsed ? (
            <></>
          ) : (
            <>
              <img
                className="admin-sidebar-logo"
                src="https://res.cloudinary.com/pankajoptical/image/upload/v1709921004/pankajoptical_LOGO_ielprm.png"
                alt="Pankaj Opticals"
              />
            </>
          )}

          <div className="demo-logo-vertical" />
          {/* <div className="logo">
            <h1>h</h1>
          </div> */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["admin"]}
            onClick={({ key }) => {
              navigate(key);
              if (isMobile) {
                setCollapsed(true);
              }
            }}
            items={[
              {
                key: "/admin",
                icon: <DashboardOutlined />,
                label: "DashBoard",
              },
              {
                key: "customers",
                icon: <UserOutlined />,
                label: "Customers",
              },

              {
                key: "products",
                icon: <ProductOutlined />,
                label: "Products",
              },
              {
                key: "coupons",
                icon: <TagFilled />,
                label: "Coupons",
              },
              {
                key: "properties",
                icon: <UnorderedListOutlined />,
                label: "Properties",
              },
            ]}
          />
        </Sider>
        <Layout className="admin-main-layout">
          <Header className="admin-header">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="admin-menu-toggle"
            />
          </Header>
          <Content className="admin-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Mainlayout;
