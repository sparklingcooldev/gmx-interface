/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import hexToRgba from "hex-to-rgba";
import Button from "../../components/Button";
import MintModal from "../../components/MintModal";
import CountDown from "../../components/CountDown";
import { useState } from "react";
import useLockInfo from "../../hooks/useLockInfo";
import { numberWithCommas, figureError } from "../../utils/functions";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import { getMintContract } from "../../utils/contracts";
import { ethers } from "ethers";
import useMintInfo from "../../hooks/useMintInfo";

const Mint = ({ setNotification }) => {
  const { accountData, fetchAccountData } = useLockInfo();
  const { mintData, mintAccountData, fetchMintData, fetchMintAccountData } =
    useMintInfo();
  const account = useAddress();
  const { connect, provider } = useWeb3Context();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [maxPressed, setMaxPressed] = useState(false);

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const onMint = async () => {
    try {
      const mintContract = getMintContract(provider.getSigner());
      let estimateGas, ttx;
      const max =
        Number(accountData[0].balance / Math.pow(10, 6)) <=
        Math.min(2000, Number(mintData.remainingTokens))
          ? accountData[0].balance
          : ethers.utils.parseUnits(
              Math.min(2000, Number(mintData.remainingTokens)),
              6
            );
      console.log(max.toString());
      estimateGas = await mintContract.estimateGas.mint(
        maxPressed ? max : ethers.utils.parseUnits(amount, 6)
      );
      console.log(estimateGas.toString());
      ttx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
      };
      const tx = await mintContract.mint(
        maxPressed ? max : ethers.utils.parseUnits(amount, 6),
        ttx
      );
      await tx.wait();
      fetchMintAccountData();
      fetchMintData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
  };

  const onClaim = async () => {
    try {
      const mintContract = getMintContract(provider.getSigner());
      let estimateGas, ttx;
      estimateGas = await mintContract.estimateGas.claim();
      console.log(estimateGas.toString());
      ttx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
      };
      const tx = await mintContract.claim(ttx);
      await tx.wait();
      fetchMintAccountData();
      fetchMintData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
  };

  let gmxDistributionData = [
    {
      name: "Remain Cap",
      value: 100 - (mintData.totalSupply / mintData.mintCap) * 100,
      color: "#4353fa",
    },
    {
      name: "Total Supply",
      value: (mintData.totalSupply / mintData.mintCap) * 100,
      color: "#0598fa",
    },
  ];

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
      <MintModal
        open={open}
        setOpen={setOpen}
        max={Math.min(
          2000,
          Number(mintData.remainingTokens),
          Number(accountData[0].balance / Math.pow(10, 6))
        )}
        amount={amount}
        setAmount={setAmount}
        maxPressed={maxPressed}
        setMaxPressed={setMaxPressed}
        pending={pending}
        setPending={setPending}
        onMint={onMint}
        mintPrice={mintData.mintPrice}
        setNotification={setNotification}
        mintOpen={mintData.mintOpen}
      />
      <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
        <Box>Mint GMD</Box>
        <Box fontSize={"16px"} fontWeight={"400"} mt={"15px"}>
          Minted GMD will be vested over 5 days
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Panel>
          <PanelHeader>
            <Box>GMD</Box>
          </PanelHeader>
          <Divider />
          <PanelBody>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Market Price</Box>
              <Box></Box>
            </Box>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Mint Price</Box>
              <Box>
                ${numberWithCommas(Number(mintData.mintPrice).toFixed(2))}
              </Box>
            </Box>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>Mint Cap</Box>
              <Box>
                {numberWithCommas(
                  Number(mintData.mintCap - mintData.totalSupply).toFixed(5)
                )}{" "}
                GMD
              </Box>
            </Box>
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>
                Max USDC amount per mint tx
              </Box>
              <Box> 2000 USDC</Box>
            </Box>
          </PanelBody>
          <Divider />
          <PanelBody
            justifyContent={"center"}
            display={"flex"}
            flexDirection={"column"}
          >
            <Box>
              <Box color={"rgba(255, 255, 255, 0.7)"}>USDC in Wallet</Box>
              <Box>
                {numberWithCommas(
                  Number(accountData[0].balance / Math.pow(10, 6)).toFixed(5)
                )}{" "}
                USDC
              </Box>
            </Box>
            <>
              <Box>
                <Box color={"rgba(255, 255, 255, 0.7)"}>Minted by user</Box>
                <Box>
                  {numberWithCommas(
                    Number(mintAccountData.mintedAmount).toFixed(5)
                  )}{" "}
                  GMD
                </Box>
              </Box>
              <Box>
                <Box color={"rgba(255, 255, 255, 0.7)"}>Vesting Time</Box>
                <Box>
                  <CountDown
                    date={
                      mintAccountData.vestPeriod
                        ? mintAccountData.vestPeriod
                        : 0
                    }
                  />
                </Box>
              </Box>
              <Box>
                <Box color={"rgba(255, 255, 255, 0.7)"}>Claimable Tokens</Box>
                <Box>
                  {numberWithCommas(
                    Number(mintAccountData.claimableTokens).toFixed(5)
                  )}{" "}
                  GMD
                </Box>
              </Box>
              <Box alignItems={"center"}>
                <Box color={"rgba(255, 255, 255, 0.7)"}>Total Supply</Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <PieChart width={160} height={160}>
                    <Pie
                      data={gmxDistributionData}
                      cx={76}
                      cy={76}
                      innerRadius={50}
                      outerRadius={63}
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
                    >
                      Total / Mint
                    </text>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                  <Box>
                    {mintData.totalSupply.toFixed(2)} /{" "}
                    {mintData.mintCap.toFixed(2)} GMD{" "}
                    {!Number(mintData.remainingTokens) ? "(Sold Out)" : ""}
                  </Box>
                </Box>
              </Box>
            </>
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
                  disabled={pending || !Number(mintData.remainingTokens)}
                  onClick={() => setOpen(true)}
                >
                  Mint
                </Button>
                <Button
                  type={"primary"}
                  width={"80px"}
                  height={"36px"}
                  disabled={pending || !Number(mintAccountData.claimableTokens)}
                  onClick={() => onClaim()}
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

export default Mint;
