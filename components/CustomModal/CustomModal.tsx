import { Modal as MUIModal, Box } from "@mui/material";
import { Wrapper } from "./style";

const CustomModal = ({ children, isOpen, onClose }) => {
  return (
    <MUIModal open={isOpen} onClose={onClose}>
      <Wrapper
        sx={{
          "& *::-webkit-scrollbar": {},
        }}
      >
        {children}
      </Wrapper>
    </MUIModal>
  );
};

export default CustomModal;
