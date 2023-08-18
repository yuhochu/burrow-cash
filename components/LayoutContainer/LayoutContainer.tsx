import React from "react";
import styled from "styled-components";

type Props = {
  children: string | React.ReactNode;
  className?: string;
};

const LayoutContainer = ({ children, className = "" }: Props) => {
  return <StyledWrapper className={className}>{children}</StyledWrapper>;
};

const StyledWrapper = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
`;

LayoutContainer.displayName = "LayoutContainer";
export default LayoutContainer;
