import styled from "styled-components";
import React from "react";

type columnType = {
  id?: string;
  header: string;
  accessorKey?: string;
  cell?: any;
  size?: number;
};

interface Props {
  columns: Array<columnType>;
  data: Array<any>;
  actionRow?: React.ReactNode;
}

const CustomTable = ({ columns, data, actionRow }: Props) => {
  const headers = columns?.map((d) => ({ text: d.header, size: d.size }));
  const headerNode = (
    <div className="custom-table-thead">
      <div className="custom-table-tr">
        {headers?.map((d) => {
          const styles: { flex?: string } = {};
          if (d.size) {
            styles.flex = `0 0 ${d.size}px`;
          }
          return (
            <div key={d.text} className="custom-table-th text-gray-400" style={styles}>
              {d.text}
            </div>
          );
        })}
      </div>
    </div>
  );

  const bodyNodes = data?.map((d, i) => {
    const tdNode = columns?.map((col) => {
      let content = null;
      if (typeof col.cell === "function") {
        content = col.cell({
          originalData: d,
        });
      } else if (col.accessorKey) {
        content = d[col.accessorKey];
      }
      const styles: { flex?: string } = {};
      if (col.size) {
        styles.flex = `0 0 ${col.size}px`;
      }
      return (
        <div className="custom-table-td" key={col.id || col.header} style={styles}>
          {content}
        </div>
      );
    });
    return (
      <div className="custom-table-row" key={i}>
        <div className="custom-table-tr">{tdNode}</div>
        {actionRow && <div className="custom-table-action">{actionRow}</div>}
      </div>
    );
  });

  return (
    <StyledTable className="custom-table">
      <div className="custom-table-thead">{headerNode}</div>
      <div className="custom-table-tbody">{bodyNodes}</div>
    </StyledTable>
  );
};

const StyledTable = styled.div`
  width: 100%;

  .custom-table-tr {
    display: flex;
  }

  .custom-table-th,
  .custom-table-td {
    flex: 1;
    word-break: break-word;
  }

  .custom-table-thead {
    border-bottom: 1px solid #31344d;

    .custom-table-th {
      text-align: left;
      padding: 10px 5px;
    }
  }

  .custom-table-tbody {
    .custom-table-td {
      padding: 15px 5px;
    }
  }

  .custom-table-action {
    //display: none;
    //height: 0;
    //overflow: hidden;
    //transition: all ease-in-out 0.3ms;
  }

  .custom-table-row {
    &:hover {
      .custom-table-action {
        display: block;
        //height: auto;
      }
    }
  }
`;
CustomTable.displayName = "CustomTable";
export default CustomTable;
