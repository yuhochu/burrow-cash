import styled from "styled-components";
import { BaseProps } from "../../interfaces/common";

// todo: use json structure instead of children
const CustomTable = ({ children }: BaseProps) => {
  return <StyledTable className="custom-table">{children}</StyledTable>;
};

const StyledTable = styled.table`
  width: 100%;

  thead {
    border-bottom: 1px solid #31344d;

    th {
      text-align: left;
      padding: 10px 5px;
    }
  }

  tbody {
    td {
      padding: 15px 5px;
    }
  }
`;

export default CustomTable;
