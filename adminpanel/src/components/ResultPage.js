import React from "react";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../CSS/ResultPage.css";

export const PageSuccess = () => {
  const navigate = useNavigate();
  return (
    <>
      <Result
        status="success"
        title="Successfully Purchased"
        subTitle={""}
        extra={[
          <Button type="primary" onClick={() => navigate("/orders")}>
            Go to Orders
          </Button>,
          <Button onClick={() => navigate("/")}>Continue Shopping?</Button>,
        ]}
      />
    </>
  );
};
export const PageInfo = ({ discription, buttonName }) => {
  const navigate = useNavigate();

  return (
    <>
      <Result
        title={discription}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            {buttonName}
          </Button>
        }
      />
    </>
  );
};

export const PageWarnings = () => {
  const navigate = useNavigate();
  return (
    <>
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    </>
  );
};

export const Page403 = () => {
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" key="/">
            Back Home
          </Button>
        }
      />
    </>
  );
};

export const Page404 = () => {
  const navigate = useNavigate();
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist. please go back"
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    </>
  );
};

export const Page500 = () => {
  return (
    <>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    </>
  );
};

export const PageSubmissonFailed = () => {
  return (
    <>
      <Result
        status="error"
        title="Image Upload Failed"
        subTitle="Please check your network"
      >
        {/* <div className="desc">
          <Paragraph>
            <Text strong className="admin-font-16">
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
            account has been frozen. <a>Thaw immediately &gt;</a>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
            account is not yet eligible to apply. <a>Apply Unlock &gt;</a>
          </Paragraph>
        </div> */}
      </Result>
    </>
  );
};

export const PageALLGood = () => {
  return (
    <>
      <Result
        icon={<SmileOutlined />}
        title="Great, we have done all the operations!"
        extra={<Button type="primary">Next</Button>}
      />
    </>
  );
};
