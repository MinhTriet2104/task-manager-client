import React from "react";
import styled from "styled-components";

import Tooltip from "./Tooltip";

const CustomHeader = styled.div`
  font-size: 15px;
  font-weight: bold;

  padding: 10px 10px 5px;

  position: relative;

  &::before {
    content: "";
    background: ${(props) => props.bgColor};

    width: 280px;
    height: 5px;

    position: absolute;
    top: -13px;
    left: -10.5px;

    border-radius: 10px;
  }
`;

export default ({ id, title, actions, color, onDelete }) => {
  return (
    <CustomHeader bgColor={color}>
      {title}
      <Tooltip
        id={id}
        title={title}
        addCard={actions.addCard}
        removeLane={onDelete}
        placement="top"
      />
    </CustomHeader>
  );
};
