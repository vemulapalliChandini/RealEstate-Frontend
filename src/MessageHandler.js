// messageHandler.js
import { message } from 'antd';
message.config({
    top: 100, 
    duration: 2, 
    style: {
        maxWidth: '400px', 
        whiteSpace: 'normal', 
      },
  });
const showMessage = (msgType, content) => {
  if (msgType === 'error') {
    message.error(content);
  } else if (msgType === 'success') {
    message.success(content);
  } else if (msgType === 'warning') {
    message.warning(content);
  } else if (msgType === 'info') {
    message.info(content);
  }
};

export default showMessage;
