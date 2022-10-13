/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import Button from "../../components/Button";
import StakingModal from "../../components/StakingModal";
import { useState } from "react";

const Earn = ({ setNotification }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(1);
  const [amount, setAmount] = useState(0);

  return (
    <StyledContainer>
      <StakingModal
        open={open}
        setOpen={setOpen}
        amount={amount}
        setAmount={setAmount}
      />
      <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
        Earn
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        {["", "", "", ""].map((data, i) => {
          return (
            <Panel key={i}>
              <PanelHeader>GMX</PanelHeader>
              <Divider />
              <PanelBody>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Price</Box>
                  <Box>$37.68</Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Wallet</Box>
                  <Box>$37.68</Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Staked</Box>
                  <Box>$37.68</Box>
                </Box>
              </PanelBody>
              <Divider />
              <PanelBody
                height={"102px"}
                justifyContent={"center"}
                display={"flex"}
                flexDirection={"column"}
              >
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>APR</Box>
                  <Box>$37.68</Box>
                </Box>
                {i === 3 ? (
                  <>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>Rewards</Box>
                      <Box>$37.68</Box>
                    </Box>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>
                        Multiplier Points APR
                      </Box>
                      <Box>$37.68</Box>
                    </Box>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>
                        Boost Percentage
                      </Box>
                      <Box>$37.68</Box>
                    </Box>
                  </>
                ) : (
                  ""
                )}
              </PanelBody>
              <Divider />
              <PanelBody>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Total Staked</Box>
                  <Box>$37.68</Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Fee</Box>
                  <Box>$37.68</Box>
                </Box>
              </PanelBody>
              <Divider />
              <Box display={"flex"}>
                {/* <Button type={"primary"} width={"136px"} height={"36px"}>
                  Connect Wallet
                </Button> */}
                <Button
                  type={"primary"}
                  width={"80px"}
                  height={"36px"}
                  onClick={() => {
                    setOpen(true);
                    setType(1);
                  }}
                >
                  Stake
                </Button>
                <Button
                  type={"primary"}
                  width={"80px"}
                  height={"36px"}
                  onClick={() => {
                    setOpen(true);
                    setType(2);
                  }}
                >
                  Unstake
                </Button>
                <Button type={"primary"} width={"80px"} height={"36px"}>
                  Claim
                </Button>
              </Box>
            </Panel>
          );
        })}
      </Box>
    </StyledContainer>
  );
};

const Panel = styled(Box)`
  padding: 15px 15px 18px;
  border: 1px solid #1e2136;
  border-radius: 4px;
  font-size: 15px;
  background: #16182e;
  width: 100%;
  max-width: calc(50% - 8px);
  @media screen and (max-width: 900px) {
    max-width: 100%;
  }
  margin-bottom: 15px;
`;

const PanelHeader = styled(Box)`
  font-size: 16px;
  line-height: 21px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #ffffff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelBody = styled(Box)`
  > div {
    display: flex;
    justify-content: space-between;
    line-height: 130%;
    margin-top: 8px;
  }
  > div:first-child {
    margin: 0;
  }
`;

const Divider = styled(Box)`
  height: 1px;
  background: #23263b;
  margin: 10.5px -15px;
`;

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding-top: 46px;
  max-width: 1264px;
  padding-left: 32px;
  padding-right: 32px;
  margin: 0 auto;
  letter-spacing: 0.5px;
  padding-bottom: 35px;
  @media screen and (max-width: 600px) {
    padding-left: 22px;
    padding-right: 22px;
  }
`;

export default Earn;
