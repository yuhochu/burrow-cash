import React from "react";
import styled from "styled-components";
import { BaseProps } from "../../interfaces/common";

export interface BoxProps extends BaseProps {
  style?: object;
}

export const ContentBox = ({ children, style }: BoxProps) => {
  return (
    <StyledBox style={style}>
      <div>{children}</div>
    </StyledBox>
  );
};

const StyledBox = styled.div`
  border-radius: 12px;
  border: 1px solid #31344d;
  background: #23253a;
`;
