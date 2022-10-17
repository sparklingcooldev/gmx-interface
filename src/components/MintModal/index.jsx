/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Dialog } from "@mui/material";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";
import { useState } from "react";
import { useEffect } from "react";
import { MINT_ADDR, USDC_ADDR } from "../../abis/address";
import { getTokenContract } from "../../utils/contracts";
import { useWeb3Context } from "../../hooks/web3Context";
import { figureError } from "../../utils/functions";
import useMintInfo from "../../hooks/useMintInfo";

const MintModal = ({
  open,
  setOpen,
  max,
  amount,
  setAmount,
  maxPressed,
  setMaxPressed,
  pending,
  setPending,
  onMint,
  mintPrice,
  setNotification,
  mintOpen,
}) => {
  const [insufficient, setInsufficient] = useState(false);
  const { provider } = useWeb3Context();
  const { fetchMintAccountData, allowance } = useMintInfo();
  const [buttonText, setButtonText] = useState("Mint is Closed");

  useEffect(() => {
    if (insufficient) setButtonText("Insufficient Amount");
    else if (!mintOpen) setButtonText("Mint not Opened");
    else if (!Number(amount)) setButtonText("Input Amount");
    else setButtonText("Confirm");
  }, [mintOpen, insufficient, amount]);

  const onApprove = async (i) => {
    setPending(true);
    try {
      const tokenContract = getTokenContract(USDC_ADDR, provider.getSigner());
      const estimateGas = await tokenContract.estimateGas.approve(
        MINT_ADDR,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      console.log(estimateGas.toString());

      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approveTx = await tokenContract.approve(
        MINT_ADDR,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        tx
      );
      await approveTx.wait();
      fetchMintAccountData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  useEffect(() => {
    if (!maxPressed && Number(amount) > max) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Panel>
        <DialogHeader>
          <Box>Mint GMD</Box>
          <AiOutlineClose cursor={"pointer"} onClick={() => setOpen(false)} />
        </DialogHeader>
        <Divider />
        <DialogBody>
          <InputSection>
            <Box>
              <Box>{"Mint"}</Box>
              <MaxButton
                onClick={() => {
                  setMaxPressed(true);
                  setAmount(max.toFixed(6));
                }}
              >
                Max: {max.toFixed(4)}
              </MaxButton>
            </Box>
            <Box>
              <input
                type={"text"}
                placeholder={"0.00"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setMaxPressed(false);
                }}
              />
              <Box>USDC</Box>
            </Box>
          </InputSection>
          <Box
            textAlign={"right"}
            color={"white"}
            fontSize={"12px"}
            mb={"10px"}
            mt={"-10px"}
          >
            = {(mintPrice ? amount / mintPrice : 0.0).toFixed(4)} GMD
          </Box>

          <Box>
            {allowance ? (
              <Button
                type={"secondary"}
                width={"100%"}
                height={"47px"}
                disabled={pending || buttonText !== "Confirm"}
                onClick={() => onMint()}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                type={"secondary"}
                width={"100%"}
                height={"47px"}
                disabled={pending}
                onClick={() => onApprove()}
              >
                Approve
              </Button>
            )}
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

export default MintModal;
