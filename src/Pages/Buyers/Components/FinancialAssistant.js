import React, { useState } from "react";
import {
  Form,
  Select,
  Button,
  notification,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  InputNumber,
  Menu,
} from "antd";
import { calculateEMI } from "./emiCalculator";
import {
  HomeOutlined,
  BankOutlined,
  DollarOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./Styles.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Title } = Typography;

const banks = [
  "SBI",
  "HDFC",
  "ICICI",
  "Axis Bank",
  "Kotak Mahindra",
  "Yes Bank",
  "PNB",
  "Bank of Baroda",
  "Union Bank of India",
  "Canara Bank",
];

const FinancialAssistant = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [emiResult, setEmiResult] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [activeSection, setActiveSection] = useState("emiCalculator");

  const checkEligibility = (loanAmount, tenure) => {
    const maxLoanAmount = 5000000;
    const minTenure = 12;

    if (loanAmount > maxLoanAmount) {
      return `${t("dashboard.res1")}`;
    }

    if (tenure < minTenure) {
      return `${t("dashboard.res2")}`;
    }

    return `${t("dashboard.res3")}`;
  };

  const handleSubmit = (values) => {
    const { bankName, loanAmount, interestRate, tenure } = values;

    const emi = calculateEMI(loanAmount, interestRate, tenure);
    const eligibilityResult = checkEligibility(loanAmount, tenure);

    setEmiResult({
      bankName,
      loanAmount,
      emi,
    });

    setEligibility(eligibilityResult);

    notification.success({
      message: "Calculation Successful",
      description: `EMI calculated successfully for ${loanAmount} with ${bankName}.`,
      placement: "topRight",
    });
  };

  return (
    <div className="financial-assistant-container">
      <ArrowLeftOutlined
        style={{ fontSize: "24px", color: "#1890ff", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />

      <Menu
        mode="horizontal"
        selectedKeys={[activeSection]}
        onClick={(e) => setActiveSection(e.key)}
      >
        <Menu.Item key="bank" icon={<BankOutlined />}>
          {t("dashboard.bank")}
        </Menu.Item>
        <Menu.Item key="emiCalculator" icon={<DollarOutlined />}>
          {t("dashboard.emi")}
        </Menu.Item>
        <Menu.Item key="loanEligibility" icon={<SearchOutlined />}>
          {t("dashboard.loan")}
        </Menu.Item>
      </Menu>

      {activeSection === "bank" && (
        <div className="animation-background">
          <Title
            level={2}
            style={{
              color: "#01233a",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {t("dashboard.bank1")}
          </Title>
          <div className="scrolling-container">
            <div className="scrolling-cards">
              <Card className="scrolling-card">
                <HomeOutlined style={{ fontSize: "24px", color: "#01233a" }} />
                <Title level={4} style={{ color: "#01233a", fontSize: "18px" }}>
                  {t("dashboard.bank2")}
                </Title>
              </Card>
              <Card className="scrolling-card">
                <BankOutlined style={{ fontSize: "24px", color: "#01233a" }} />
                <Title level={4} style={{ color: "#01233a", fontSize: "18px" }}>
                  {t("dashboard.bank3")}
                </Title>
              </Card>
              <Card className="scrolling-card">
                <SearchOutlined
                  style={{ fontSize: "24px", color: "#01233a" }}
                />
                <Title level={4} style={{ color: "#01233a", fontSize: "18px" }}>
                  {t("dashboard.bank4")}
                </Title>
              </Card>
              <Card className="scrolling-card">
                <ClockCircleOutlined
                  style={{ fontSize: "24px", color: "#01233a" }}
                />
                <Title level={4} style={{ color: "#01233a", fontSize: "18px" }}>
                  {t("dashboard.bank5")}
                </Title>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeSection === "emiCalculator" && (
        <Card
          hoverable
          style={{
            marginTop: "20px",
            borderRadius: "8px",
            width: "35%",
            margin: "0 auto",
            paddingLeft: "30px",
            paddingRight: "30px",
            background: "rgba(235, 245, 252, 1)",
            border: "1px solid black",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: "350px", margin: "0 auto" }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  label={t("dashboard.Bank Name")}
                  name="bankName"
                  rules={[{ required: true, message: "Please select a bank" }]}
                >
                  <Select
                    placeholder={t("dashboard.SelectBank")}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {banks.map((bank) => (
                      <Option key={bank} value={bank}>
                        {bank}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={t("dashboard.Loan Amount")}
                  name="loanAmount"
                  rules={[
                    { required: true, message: "Please enter the loan amount" },
                  ]}
                >
                  <InputNumber size="large" style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={t("dashboard.Interest Rate")}
                  name="interestRate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the interest rate",
                    },
                  ]}
                >
                  <InputNumber size="large" style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={t("dashboard.Tenure")}
                  name="tenure"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the tenure in months",
                    },
                  ]}
                >
                  <InputNumber size="large" style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: "100%", marginBottom: "-10%" }}
                  >
                    {t("dashboard.Calculate")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {emiResult && (
            <>
              <Divider />
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Card
                    title={t("dashboard.res")}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p>
                      <strong>EMI:</strong> {emiResult.emi.toFixed(2)}
                    </p>
                    <p>
                      <strong>{t("dashboard.status")}</strong> {eligibility}
                    </p>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Card>
      )}

      {activeSection === "loanEligibility" && (
        <div
          className="loan-eligibility-section"
          style={{ textAlign: "center" }}
        >
          <Title level={3}>{t("dashboard.loan1")}</Title>
        </div>
      )}
    </div>
  );
};

export default FinancialAssistant;
