

import React, { useState } from "react";
import { Button, Modal } from "antd";
import VRTour from "./VRTour";

const PropertyVR = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        View Virtual Tour
      </Button>
      <Modal
        title="Virtual Tour"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <VRTour imageURL="https://plus.unsplash.com/premium_photo-1692401751970-5ccb760c6d38?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      </Modal>
    </div>
  );
};

export default PropertyVR;










