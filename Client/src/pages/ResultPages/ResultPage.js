import React from "react";
import "../../CSS/resultPage.css";
import { Result, Button, Typography } from "antd";
import {
  CloseCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RESET_STATE } from "../../redux/features/product/orderSlice";

const { Paragraph, Text } = Typography;

/* =========================
   SUCCESS PAGE
========================= */

export const PageSuccess = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (path) => {
    dispatch(RESET_STATE());
    navigate(path);
  };

  return (
    <Result
      status="success"
      title="Successfully Purchased"
      subTitle="Your order has been placed successfully."
      extra={[
        <Button
          key="orders"
          type="primary"
          onClick={() => handleNavigate("/orders")}
        >
          Go to Orders
        </Button>,

        <Button
          key="home"
          onClick={() => handleNavigate("/")}
        >
          Continue Shopping
        </Button>,
      ]}
    />
  );
});

/* =========================
   INFO PAGE
========================= */

export const PageInfo = React.memo(
  ({ description, buttonName }) => {
    const navigate = useNavigate();

    return (
      <Result
        status="info"
        title={description}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
          >
            {buttonName}
          </Button>
        }
      />
    );
  }
);

/* =========================
   WARNING PAGE
========================= */

export const PageWarnings = React.memo(() => {
  const navigate = useNavigate();

  return (
    <Result
      status="warning"
      title="There are some problems with your operation."
      extra={
        <Button
          type="primary"
          onClick={() => navigate("/")}
        >
          Back Home
        </Button>
      }
    />
  );
});

/* =========================
   403 PAGE
========================= */

export const Page403 = React.memo(() => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button
          type="primary"
          onClick={() => navigate("/")}
        >
          Back Home
        </Button>
      }
    />
  );
});

/* =========================
   404 PAGE
========================= */

export const Page404 = React.memo(() => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => navigate("/")}
        >
          Back Home
        </Button>
      }
    />
  );
});

/* =========================
   500 PAGE
========================= */

export const Page500 = React.memo(() => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button
          type="primary"
          onClick={() => navigate("/")}
        >
          Back Home
        </Button>
      }
    />
  );
});

/* =========================
   SUBMISSION FAILED PAGE
========================= */

export const PageSubmissionFailed = React.memo(() => {
  return (
    <Result
      status="error"
      title="Submission Failed"
      subTitle="Please check and modify the information before resubmitting."
      extra={[
        <Button key="console" type="primary">
          Go Console
        </Button>,

        <Button key="buy">
          Buy Again
        </Button>,
      ]}
    >
      <div className="desc">
        <Paragraph>
          <Text strong className="client-font-16">
            The content you submitted has the following errors:
          </Text>
        </Paragraph>

        <Paragraph>
          <CloseCircleOutlined /> Your account has been frozen.
          <a href="/"> Thaw immediately</a>
        </Paragraph>

        <Paragraph>
          <CloseCircleOutlined /> Your account is not yet eligible to apply.
          <a href="/"> Apply Unlock</a>
        </Paragraph>
      </div>
    </Result>
  );
});

/* =========================
   ALL GOOD PAGE
========================= */

export const PageALLGood = React.memo(() => {
  return (
    <Result
      icon={<SmileOutlined />}
      title="Great, we have completed all operations!"
      extra={
        <Button type="primary">
          Next
        </Button>
      }
    />
  );
});
