/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import Stats from "./Stats";
import Tokens from "./Tokens";
import Composition from "./Composition";

const Dashboard = ({ setNotification }) => {
  return (
    <StyledContainer>
      <Stats />
      <Tokens />
      <Composition />
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding-top: 46px;
  max-width: 1264px;
  padding-left: 32px;
  padding-right: 32px;
  margin: 0 auto;
  letter-spacing: 0.5px;
  @media screen and (max-width: 600px) {
    padding-left: 22px;
    padding-right: 22px;
  }
`;

export default Dashboard;
