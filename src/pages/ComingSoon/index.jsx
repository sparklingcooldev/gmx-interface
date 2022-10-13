import { Box } from "@mui/material";
import styled from "styled-components";

const ComingSoon = () => {
  return (
    <StyledContainer>
      <Box>COMING SOON</Box>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: calc(100vh - 200px);
  justify-content: center;
  align-items: center;
  font-size: 72px;
  font-weight: bold;
  letter-spacing: 6px;
  > div {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    white-space: nowrap;
    width: fit-content;
  }
  @media screen and (max-width: 1200px) {
  }
  @media screen and (max-width: 650px) {
    font-size: 48px;
  }
`;

export default ComingSoon;
