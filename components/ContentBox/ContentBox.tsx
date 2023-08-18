import React from "react";
import styled from "styled-components";
import { BaseProps } from "../../interfaces/common";

export interface BoxProps extends BaseProps {
  style?: object;
}

export const ContentBox = ({ children, style, className }: BoxProps) => {
  return (
    <StyledBox style={style} className={className}>
      <div>{children}</div>
    </StyledBox>
  );
};

const StyledBox = styled.div<{ padding?: string }>`
  position: relative;
  border-radius: 12px;
  border: 1px solid #31344d;
  background: #23253a;
  padding: ${(p) => p.padding ?? "20px 30px"};
`;
