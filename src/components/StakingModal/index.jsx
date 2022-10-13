/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Box, Dialog, useMediaQuery, Slider } from "@mui/material";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";

const StakingModal = ({ open, setOpen, type, amount, setAmount }) => {
  const [active, setActive] = useState(1);
  const [insufficient, setInsufficient] = useState(false);

  const sm = useMediaQuery("(max-width : 450px)");

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Panel>
        <DialogHeader>
          <Box>{type === 1 ? "Stake" : "Unstake"} GMX</Box>
          <AiOutlineClose cursor={"pointer"} onClick={() => setOpen(false)} />
        </DialogHeader>
        <Divider />
        <DialogBody>
          <InputSection>
            <Box>
              <Box>Stake</Box>
              <Box>Max: 0.0000</Box>
            </Box>
            <Box>
              <input
                type={"text"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Box>GMX</Box>
            </Box>
          </InputSection>
          <Box>
            <Button type={"secondary"} width={"100%"} height={"47px"}>
              Confirm
            </Button>
          </Box>
        </DialogBody>
      </Panel>
    </Dialog>
  );
};

const InputSection = styled(Box)`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    rgba(30, 34, 61, 0.9) 0%,
    rgba(38, 43, 71, 0.9) 100%
  );
  box-shadow: inset 0px 0px 30px 5px rgb(255 255 255 / 1%);
  > div {
    display: flex;
    justify-content: space-between;
    color: white;
  }
  > div:nth-child(1) {
    opacity: 0.7;
    font-size: 14px;
    padding-bottom: 12px;
  }
  > div:nth-child(2) {
    font-size: 21px;
  }
  > div > input {
    width: 100%;
    background: transparent;
    color: white;
    font-family: "Relative";
  }
`;

const DialogBody = styled(Box)`
  margin: 15px;
  font-size: 15px;
`;

const Divider = styled(Box)`
  height: 1px;
  background: #ffffff29;
  margin: 10.5px -15px;
`;

const Panel = styled(Box)`
  position: relative;
  max-width: 100%;
  max-height: 90vh;
  overflow: auto;
  background: #16182e;
  border-radius: 4px;
  width: 310px;
  font-family: "Relative";
`;

const DialogHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin: 15px;
`;

export default StakingModal;
