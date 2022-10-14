/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Dialog } from "@mui/material";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";
import { useState } from "react";
import { useEffect } from "react";

const StakingModal = ({
  open,
  setOpen,
  type,
  amount,
  setAmount,
  balance,
  maxPressed,
  setMaxPressed,
  pending,
  symbol,
  onConfirm,
}) => {
  const [insufficient, setInsufficient] = useState(false);

  useEffect(() => {
    console.log(maxPressed);

    if (Number(amount) > Number(balance) && !maxPressed) {
      setInsufficient(true);
    } else setInsufficient(false);
  }, [maxPressed, balance, amount]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Panel>
        <DialogHeader>
          <Box>
            {type === 1 ? "Stake" : "Unstake"} {symbol}
          </Box>
          <AiOutlineClose cursor={"pointer"} onClick={() => setOpen(false)} />
        </DialogHeader>
        <Divider />
        <DialogBody>
          <InputSection>
            <Box>
              <Box>{type === 1 ? "Stake" : "Unstake"}</Box>
              <MaxButton
                onClick={() => {
                  setMaxPressed(true);
                  setAmount(balance);
                }}
              >
                Max: {balance.toFixed(4)}
              </MaxButton>
            </Box>
            <Box>
              <input
                type={"text"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setMaxPressed(false);
                }}
                placeholder={"0.00"}
              />
              <Box>{symbol}</Box>
            </Box>
          </InputSection>
          {insufficient ? (
            <Box
              textAlign={"right"}
              color={"tomato"}
              fontSize={"12px"}
              mb={"10px"}
              mt={"-10px"}
            >
              Insufficient Amount
            </Box>
          ) : (
            ""
          )}
          <Box>
            <Button
              type={"secondary"}
              width={"100%"}
              height={"47px"}
              disabled={pending || insufficient || !Number(amount)}
              onClick={() => onConfirm()}
            >
              Confirm
            </Button>
          </Box>
        </DialogBody>
      </Panel>
    </Dialog>
  );
};

const MaxButton = styled(Box)`
  cursor: pointer;
  :hover {
    color: white;
  }
`;

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
