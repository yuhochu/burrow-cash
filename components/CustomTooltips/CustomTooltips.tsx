import React from "react";
import styled from "styled-components";

const CustomTooltips = ({ children, text, width = 300, alwaysShow = false }) => {
  const styles: { width?: number; display?: string } = { width };
  if (alwaysShow) {
    styles.display = "block";
  }
  return (
    <StyledWrapper>
      <div className="_tooltips" style={styles}>
        {text}
      </div>
      {children}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;

  ._tooltips {
    position: absolute;
    bottom: 100%;
    margin-bottom: 8px;
    display: none;
    border-radius: 5px;
    border: 1px solid #4f5178;
    padding: 7px 7px 6px;
    background: #2e304b;
    line-height: 1.1;
    box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.15);
    width: 351px;
    font-size: 11px;
    right: 0;
    font-weight: 400;
  }

  &:hover {
    ._tooltips {
      display: block;
    }
  }
`;

export default CustomTooltips;
