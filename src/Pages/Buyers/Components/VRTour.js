

import React from "react";
import "aframe";

const VRTour = ({ imageURL }) => {
  return (
    <a-scene>

      <a-sky src={imageURL} rotation="0 -90 0"></a-sky>



      <a-entity
        camera
        position="0 1.6 0"
        wasd-controls="acceleration: 200"
        look-controls
      ></a-entity>

  
      <a-entity
        cursor="fuse: true; maxDistance: 20; fuseTimeout: 500"
        position="0 0 -3"
        geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.04"
        material="color: black; shader: flat"
      ></a-entity>
    </a-scene>
  );
};

export default VRTour;














