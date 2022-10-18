/* eslint-disable no-undef */
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
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import hexToRgba from "hex-to-rgba";

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
  const urls = [
    "/icons/usdc.svg",
    "/icons/eth.svg",
    "/icons/bitcoin.svg",
    "/icons/gmd.png",
  ];
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

      const limitamount =
        (BigInt(pool[curIndex].vaultcap) - BigInt(pool[curIndex].totalStaked)) /
        BigInt(Math.pow(10, 18 - decimals[curIndex] / 1));

      const maxBalance =
        BigInt(accountData[curIndex].balance) <= limitamount
          ? accountData[curIndex].balance
          : limitamount.toString();

      const maxETHBalance =
        BigInt(accountData[curIndex].ethBalance) <= limitamount
          ? accountData[curIndex].ethBalance
          : limitamount.toString();

      let estimateGas, ttx;
      if (type === 1) {
        if (!isWETH && curIndex === 1) {
          estimateGas = await valutContract.estimateGas.enterETH(curIndex, {
            value: maxPressed
              ? maxETHBalance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
          });
        } else
          estimateGas = await valutContract.estimateGas.enter(
            maxPressed
              ? maxBalance
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

      const tx = {
        gasLimit: Math.floor(estimateGas.toString() * 1.2),
      };
      if (type === 1) {
        if (!isWETH && curIndex === 1) {
          ttx = await valutContract.enterETH(curIndex, {
            value: maxPressed
              ? maxETHBalance
              : ethers.utils.parseUnits(amount, decimals[curIndex]),
            gasLimit: Math.floor(estimateGas.toString() * 1.2),
          });
        } else
          ttx = await valutContract.enter(
            maxPressed
              ? maxBalance
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

  const [gmxActiveIndex, setGMXActiveIndex] = useState(null);

  const onGMXDistributionChartEnter = (_, index) => {
    setGMXActiveIndex(index);
  };

  const onGMXDistributionChartLeave = (_, index) => {
    setGMXActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="stats-label">
          <div
            className="stats-label-color"
            style={{ backgroundColor: payload[0].color }}
          ></div>
          {payload[0].value.toFixed(2)}% {payload[0].name}
        </div>
      );
    }
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
        limit={
          (pool[curIndex].vaultcap - pool[curIndex].totalStaked) /
          Math.pow(10, 18)
        }
      />
      <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
        Earn
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        {pool.map((data, i) => {
          let gmxDistributionData = [
            {
              name: "Remain Cap",
              value: 100 - (data.totalStaked / data.vaultcap) * 100,
              color: "#4353fa",
            },
            {
              name: "Total Staked",
              value: (data.totalStaked / data.vaultcap) * 100,
              color: "#0598fa",
            },
          ];
          return (
            <Panel key={i}>
              <PanelHeader>
                <Box>
                  <CoinSVG
                    style={{
                      background: `url(${urls[i]})`,
                      backgroundSize: "100% 100%",
                      width: i === 3 ? "35px" : "40px",
                    }}
                    mr={"8px"}
                  />
                </Box>
                <Box>{symbol[i]}</Box>
              </PanelHeader>
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
                  <Box color={"rgba(255, 255, 255, 0.7)"}>APY</Box>
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
                <Box alignItems={"center"} mb={"20px!important"}>
                  <Box color={"rgba(255, 255, 255, 0.7)"}>
                    Total Staked in Pool
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <PieChart width={180} height={180}>
                      <Pie
                        data={gmxDistributionData}
                        cx={86}
                        cy={86}
                        innerRadius={60}
                        outerRadius={73}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        onMouseEnter={onGMXDistributionChartEnter}
                        onMouseOut={onGMXDistributionChartLeave}
                        onMouseLeave={onGMXDistributionChartLeave}
                      >
                        {gmxDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            style={{
                              filter:
                                gmxActiveIndex === index
                                  ? `drop-shadow(0px 0px 6px ${hexToRgba(
                                      entry.color,
                                      0.7
                                    )})`
                                  : "none",
                              cursor: "pointer",
                            }}
                            stroke={entry.color}
                            strokeWidth={gmxActiveIndex === index ? 1 : 1}
                          />
                        ))}
                      </Pie>
                      <text
                        x={"50%"}
                        y={"50%"}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={"12px"}
                        letterSpacing={"0px"}
                      >
                        Staked / Valut Cap
                      </text>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                    <Box>
                      {(pool[i].totalStaked / Math.pow(10, 18)).toFixed(2)} /{" "}
                      {(pool[i].vaultcap / Math.pow(10, 18)).toFixed(2)}{" "}
                      {symbol[i]}{" "}
                      {BigInt(pool[i].totalStaked) >= BigInt(pool[i].vaultcap)
                        ? "(Fully Reached)"
                        : ""}
                    </Box>
                  </Box>
                </Box>
                <Divider />
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
                      disabled={
                        pending ||
                        BigInt(pool[i].totalStaked) >=
                          BigInt(pool[i].vaultcap) ||
                        !pool[i].stakable
                      }
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
                      disabled={
                        pending ||
                        !pool[i].withdrawable ||
                        !Number(accountData[i].gdBalance)
                      }
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
