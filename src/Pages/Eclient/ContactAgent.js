import React from "react";
import {
  Form,
  DatePicker,
  TimePicker,
  Input,
  Button,
  Modal,
} from "antd";
import moment from "moment";
import { _post } from "../../Service/apiClient";
import { useTranslation } from "react-i18next";

const ContactAgent = ({ isModalVis, setIsModalVis, estate, agent }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const disablePastDates = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleFormSubmit = async (values) => {
    const formattedDate = values.bookingDate
      ? values.bookingDate.format("YYYY-MM-DD")
      : null;
    const formattedTime = values.bookingTime
      ? values.bookingTime.format("HH:mm:ss")
      : null;

      const requestBody = {
        agentId: agent._id,
        estId: estate._id,
        date: formattedDate,
        timing: formattedTime,
        location: values.location,
      };
      await _post(
        "/emBooking/clientBook",
        requestBody,
        "Appointment booked successfully!",
        "Failed to book the appointment. Please try again."
      )
        .then((response) => {
          if (response.status === 200) {
            setIsModalVis(false);
            form.resetFields();
          }
        })
        .catch((error) => {
          console.error("Error booking appointment:", error);
        });
  };

  return (
    <div style={{ padding: "10px" }}>
      <Modal
        title={
          <div className="PropertyStyle">
            <span>
              {`${agent.firstName} ${agent.lastName}`?.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
            </span>
          </div>
        }
        open={isModalVis}
        onCancel={() => {
          setIsModalVis(!isModalVis);
        }}
        width={400}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{
            width: "90%",
            margin: "10px auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Form.Item
            label={t("dashboard.date")}
            name="bookingDate"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={disablePastDates}
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard.time")}
            name="bookingTime"
            rules={[{ required: true, message: "Please select the time!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="h:mm a" minuteStep={15}/>
          </Form.Item>

          <Form.Item
            label={t("dashboard.Location")}
            name="location"
            rules={[{ required: true, message: "Please enter the location!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              {t("dashboard.book")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default ContactAgent;
