/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import Button from "../../components/Button";
import GMDStakingModal from "../../components/GMDStakingModal";
import { useState } from "react";
import useTokenInfo from "../../hooks/useTokenInfo";
import useLockInfo from "../../hooks/useLockInfo";
import { numberWithCommas, figureError } from "../../utils/functions";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import useGMDStakingInfo from "../../hooks/useGMDStakingInfo";
import { getGMDStakingContract } from "../../utils/contracts";
import { ethers } from "ethers";

const Stake = ({ setNotification }) => {
  const { price, pool } = useTokenInfo();
  const {
    allowance,
    balance,
    totalStaked,
    withdrawable,
    apy,
    reward,
    stakedAmount,
    fetchStakingData,
    fetchStakingAccountData,
  } = useGMDStakingInfo();

  const account = useAddress();
  const { connect, provider } = useWeb3Context();

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(1);
  const [curIndex, setCurIndex] = useState(0);
  const [amount, setAmount] = useState(0);
  const [maxPressed, setMaxPresssed] = useState(false);
  const [pending, setPending] = useState(false);
  const [isWETH, setIsWETH] = useState(false);

  const decimals = [6, 18, 8, 18];

  const getBalance = (amount, decimals = 18) => {
    return numberWithCommas((amount / Math.pow(10, decimals)).toFixed(5));
  };
  const getBalanceUSD = (amount, price, decimals = 18) => {
    return numberWithCommas(
      ((price * amount) / Math.pow(10, decimals)).toFixed(5)
    );
  };

  const onConfirm = async () => {
    setPending(true);
    try {
      const stakingContract = getGMDStakingContract(provider.getSigner());
      let estimateGas, tx;
      if (type === 1) {
        estimateGas = await stakingContract.estimateGas.deposit(
          0,
          maxPressed ? balance : ethers.utils.parseEther(amount)
        );
      } else {
        estimateGas = await stakingContract.estimateGas.withdraw(
          0,
          maxPressed ? stakedAmount : ethers.utils.parseEther(amount)
        );
      }
      console.log(estimateGas.toString());

      const ttx = {
        gasLimit: Math.ceil(estimateGas.toString() * 1.2),
      };
      if (type === 1) {
        tx = await stakingContract.deposit(
          0,
          maxPressed ? balance : ethers.utils.parseEther(amount),
          ttx
        );
      } else {
        tx = await stakingContract.withdraw(
          0,
          maxPressed ? stakedAmount : ethers.utils.parseEther(amount),
          ttx
        );
      }
      await tx.wait();
      fetchStakingAccountData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onClaim = async () => {
    setPending(true);
    try {
      const stakingContract = getGMDStakingContract(provider.getSigner());
      let estimateGas, tx;
      estimateGas = await stakingContract.estimateGas.deposit(0, 0);
      console.log(estimateGas.toString());

      const ttx = {
        gasLimit: Math.ceil(estimateGas.toString() * 1.2),
      };
      tx = await stakingContract.deposit(0, 0, ttx);
      await tx.wait();
      fetchStakingAccountData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  return (
    <StyledContainer>
      <GMDStakingModal
        open={open}
        setOpen={setOpen}
        maxPressed={maxPressed}
        setMaxPressed={setMaxPresssed}
        onConfirm={onConfirm}
        pending={pending}
        setPending={setPending}
        setNotification={setNotification}
        max={
          type === 1
            ? balance / Math.pow(10, 18)
            : stakedAmount / Math.pow(10, 18)
        }
        amount={amount}
        setAmount={setAmount}
        type={type}
      />
      <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
        Stake
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Panel>
          <PanelHeader>
            <Box>
              <CoinSVG
                style={{
                  background: `url(/icons/gmd.png)`,
                  backgroundSize: "100% 100%",
                  width: "35px",
                }}
                mr={"8px"}
              />
            </Box>
            <Box>GMD</Box>
          </PanelHeader>
          <Divider />
          <PanelBody>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Price</Box>
              <Box>${price.toFixed(2)}</Box>
            </Box>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Wallet</Box>
              <Box>
                {getBalance(balance)} GMD (${getBalanceUSD(balance, price)})
              </Box>
            </Box>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>APR</Box>
              <Box>{apy}%</Box>
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
              <Box color={"rgba(255, 255, 255, 0.7)"}>Staked</Box>
              <Box>
                {getBalance(stakedAmount)} GMD ($
                {getBalanceUSD(stakedAmount, price)})
              </Box>
            </Box>

            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Rewards</Box>
              <Box>
                {getBalance(reward, 0)} WETH ($
                {getBalanceUSD(reward, pool[1].price, 0)})
              </Box>
            </Box>
          </PanelBody>
          <Divider />
          <PanelBody>
            <Box alignItems={"center"} mb={"20px!important"}>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Total Staked in Pool</Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box>
                  {getBalance(totalStaked, 0)} GMD ($
                  {getBalanceUSD(totalStaked, price, 0)})
                </Box>
              </Box>
            </Box>
          </PanelBody>
          <Divider />
          <Box display={"flex"}>
            {!account ? (
              <Button
                type={"primary"}
                width={"136px"}
                height={"36px"}
                onClick={() => onConnect()}
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Button
                  type={"primary"}
                  width={"80px"}
                  height={"36px"}
                  disabled={pending}
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
                  disabled={pending || !withdrawable}
                  onClick={() => {
                    setOpen(true);
                    setType(2);
                  }}
                >
                  Unstake
                </Button>
                <Button
                  type={"primary"}
                  width={"80px"}
                  height={"36px"}
                  disabled={pending || !Number(reward)}
                  onClick={() => {
                    onClaim();
                  }}
                >
                  Claim
                </Button>
              </>
            )}
          </Box>
        </Panel>
      </Box>
    </StyledContainer>
  );
};

const CoinSVG = styled(Box)`
  width: 40px;
  height: 40px;
`;

const Panel = styled(Box)`
  padding: 15px 15px 18px;
  border: 1px solid #1e2136;
  border-radius: 4px;
  font-size: 15px;
  background: #16182e;
  width: 100%;
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
  max-width: 600px;
  padding-left: 32px;
  padding-right: 32px;
  margin: 0 auto;
  letter-spacing: 0.5px;
  padding-bottom: 100px;
  @media screen and (max-width: 600px) {
    padding-left: 22px;
    padding-right: 22px;
  }
`;
export default Stake;
