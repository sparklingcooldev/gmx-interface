/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import Button from "../../components/Button";
import StakingModal from "../../components/StakingModal";
import { useState } from "react";
import useTokenInfo from "../../hooks/useTokenInfo";
import useLockInfo from "../../hooks/useLockInfo";
import { numberWithCommas, figureError } from "../../utils/functions";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import { BTC_ADDR, ETH_ADDR, USDC_ADDR, VAULT_ADDR } from "../../abis/address";
import { getTokenContract, getVaultContract } from "../../utils/contracts";
import { ethers } from "ethers";

const Earn = ({ setNotification }) => {
  const { pool, fetchData } = useTokenInfo();
  const { accountData, fetchAccountData } = useLockInfo();
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
  const symbol = ["USDC", "ETH", "BTC", "GMD"];
  const fees = ["0.5", "0.25", "0.25", "0.0"];
  const addresses = [USDC_ADDR, ETH_ADDR, BTC_ADDR, USDC_ADDR];

  const getBalance = (amount, i) => {
    return numberWithCommas((amount / Math.pow(10, decimals[i])).toFixed(5));
  };
  const getBalanceUSD = (amount, price, i) => {
    return numberWithCommas(
      ((price * amount) / Math.pow(10, decimals[i])).toFixed(5)
    );
  };

  const onConfirm = async (i) => {
    setPending(true);
    try {
      const valutContract = getVaultContract(provider.getSigner());
      let rate =
        ethers.utils.parseEther("1") / pool[curIndex].GDpriceToStakedToken;
      console.log(rate);
      let estimateGas, ttx;
      console.log(curIndex);
      if (type === 1) {
        if (!isWETH && curIndex === 1) {
          estimateGas = await valutContract.estimateGas.enterETH(curIndex, {
            value: maxPressed
              ? accountData[curIndex].ethBalance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
          });
        } else
          estimateGas = await valutContract.estimateGas.enter(
            maxPressed
              ? accountData[curIndex].balance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
            curIndex
          );
      }
      if (type === 2) {
        let total = Math.floor(
          (maxPressed
            ? accountData[curIndex].stakedAmount
            : ethers.utils.parseUnits(amount, 18)) * rate
        );
        if (!isWETH && curIndex === 1) {
          estimateGas = await valutContract.estimateGas.leaveETH(
            Number(total) > Number(accountData[curIndex].gdBalance)
              ? accountData[curIndex].gdBalance.toString()
              : total.toString(),
            curIndex
          );
        } else {
          estimateGas = await valutContract.estimateGas.leave(
            Number(total) > Number(accountData[curIndex].gdBalance)
              ? accountData[curIndex].gdBalance.toString()
              : total.toString(),
            curIndex
          );
        }
      }
      console.log(estimateGas.toString());
      const tx = {
        gasLimit: Math.floor(estimateGas.toString() * 1.2),
      };
      if (type === 1) {
        if (!isWETH && curIndex === 1) {
          ttx = await valutContract.enterETH(curIndex, {
            value: maxPressed
              ? accountData[curIndex].ethBalance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
            gasLimit: Math.floor(estimateGas.toString() * 1.2),
          });
        } else
          ttx = await valutContract.enter(
            maxPressed
              ? accountData[curIndex].balance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
            curIndex,
            tx
          );
      }
      if (type === 2) {
        let total = Math.floor(
          (maxPressed
            ? accountData[curIndex].stakedAmount
            : ethers.utils.parseUnits(amount, 18)) * rate
        );
        if (!isWETH && curIndex === 1) {
          ttx = await valutContract.leaveETH(
            Number(total) > Number(accountData[curIndex].gdBalance)
              ? accountData[curIndex].gdBalance.toString()
              : total.toString(),
            curIndex,
            tx
          );
        } else {
          ttx = await valutContract.leave(
            Number(total) > Number(accountData[curIndex].gdBalance)
              ? accountData[curIndex].gdBalance.toString()
              : total.toString(),
            curIndex,
            tx
          );
        }
      }
      await ttx.wait();
      fetchAccountData();
      fetchData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  return (
    <StyledContainer>
      <StakingModal
        open={open}
        setOpen={setOpen}
        amount={amount}
        setAmount={setAmount}
        type={type}
        balance={
          type === 1
            ? accountData[curIndex].balance / Math.pow(10, decimals[curIndex])
            : accountData[curIndex].stakedAmount / Math.pow(10, 18)
        }
        ethBalance={accountData[curIndex].ethBalance / Math.pow(10, 18)}
        gdBalance={accountData[curIndex].gdBalance}
        withdrawable={pool[curIndex].withdrawable}
        setMaxPressed={setMaxPresssed}
        maxPressed={maxPressed}
        pending={pending}
        setPending={setPending}
        onConfirm={onConfirm}
        symbol={symbol[curIndex]}
        allowance={accountData[curIndex].allowance}
        setNotification={setNotification}
        address={addresses[curIndex]}
        isWETH={isWETH}
        setIsWETH={setIsWETH}
      />
      <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
        Earn
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        {pool.map((data, i) => {
          return (
            <Panel key={i}>
              <PanelHeader>{symbol[i]}</PanelHeader>
              <Divider />
              <PanelBody>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Price</Box>
                  <Box>${numberWithCommas(data.price.toFixed(2))}</Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Wallet</Box>
                  <Box>
                    {getBalance(
                      i === 1
                        ? accountData[i].ethBalance
                        : accountData[i].balance,
                      i
                    )}{" "}
                    {symbol[i]} ($
                    {getBalanceUSD(
                      i === 1
                        ? accountData[i].ethBalance
                        : accountData[i].balance,
                      pool[i].price,
                      i
                    )}
                    )
                  </Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>APR</Box>
                  <Box>{pool[i].apr}%</Box>
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
                    {getBalance(accountData[i].stakedAmount, 1)} {symbol[i]} ($
                    {getBalanceUSD(
                      accountData[i].stakedAmount,
                      pool[i].price,
                      1
                    )}
                    )
                  </Box>
                </Box>
                {i === 3 ? (
                  <>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>Rewards</Box>
                      <Box>$0.00</Box>
                    </Box>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>
                        Multiplier Points APR
                      </Box>
                      <Box>$0.00</Box>
                    </Box>
                    <Box>
                      <Box color={"rgba(255, 255, 255, 0.7)"}>
                        Boost Percentage
                      </Box>
                      <Box>$0.00</Box>
                    </Box>
                  </>
                ) : (
                  ""
                )}
              </PanelBody>
              <Divider />
              <PanelBody>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>
                    Total Staked in Pool
                  </Box>
                  <Box>
                    {getBalance(pool[i].totalStaked, 1)} {symbol[i]} ($
                    {getBalanceUSD(pool[i].totalStaked, pool[i].price, 1)})
                  </Box>
                </Box>
                <Box>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>Fee</Box>
                  <Box>{fees[i]}%</Box>
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
                        setCurIndex(i);
                      }}
                    >
                      Stake
                    </Button>
                    <Button
                      type={"primary"}
                      width={"80px"}
                      height={"36px"}
                      disabled={pending}
                      onClick={() => {
                        setOpen(true);
                        setType(2);
                        setCurIndex(i);
                      }}
                    >
                      Unstake
                    </Button>
                    {i === 3 ? (
                      <Button
                        type={"primary"}
                        width={"80px"}
                        height={"36px"}
                        disabled={pending}
                      >
                        Claim
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
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
