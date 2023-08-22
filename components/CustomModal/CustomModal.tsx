import styled from "styled-components";
import { twMerge } from "tailwind-merge";
import React from "react";
import Portal from "./portal";
import { BaseProps } from "../../interfaces/common";

type onClickHandler = (event: React.MouseEvent<HTMLElement>) => any;

interface Props extends BaseProps {
  isOpen: boolean;
  size?: string;
  width?: number;
  canScroll?: boolean;
  onClose: onClickHandler;
  onOutsideClick?: onClickHandler;
}

const CustomModal = ({
  children,
  isOpen,
  onClose,
  onOutsideClick,
  size,
  width,
  canScroll,
}: Props) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShow(!!isOpen);
    }, 100);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const styles: { width?: number } = {};
  if (width) {
    styles.width = width;
  }
  return (
    <Portal>
      <StyledWrapper className={twMerge("modal fade", show && "show")}>
        <div className="overlay" onClick={onOutsideClick} />
        <div className={twMerge("modal-dialog background-paper", size && `modal-${size}`)}>
          <div className="modal-content" style={styles}>
            <div className={twMerge("modal-body", canScroll && "modal-body-scroll")}>
              {children}
            </div>
          </div>
        </div>
      </StyledWrapper>
    </Portal>
  );
};

const StyledWrapper = styled.div`
  .custom-table-th {
  }
`;

export default CustomModal;
