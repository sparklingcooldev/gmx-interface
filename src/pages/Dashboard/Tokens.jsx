/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import hexToRgba from "hex-to-rgba";
import { useState } from "react";
import useMintInfo from "../../hooks/useMintInfo";
import { numberWithCommas } from "../../utils/functions";

const Tokens = () => {
  const { mintData } = useMintInfo();
  let gmxDistributionData = [
    {
      name: "staked",
      value: 0,
      color: "#4353fa",
    },
    {
      name: "in liquidity",
      value: 0,
      color: "#0598fa",
    },
    {
      name: "not staked",
      value: 100,
      color: "#5c0af5",
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
          {payload[0].value}% {payload[0].name}
        </div>
      );
    }
  };

  const GMD = [
    { text: "Price", value: "$0.00" },
    {
      text: "Supply",
      value: `${numberWithCommas(mintData.totalSupply.toFixed(2))} GMD`,
    },
    { text: "Total Staked", value: "$0.00" },
    { text: "Market Cap", value: "$0.00" },
  ];

  return (
    <Box mt={"31px"}>
      <Box display={"flex"} alignItems={"center"}>
        <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
          Tokens
        </Box>
        <ArbitranSVG ml={"10px"} />
      </Box>
      <Box fontSize={"15px"} lineHeight={"21px"} color={"#b7b7bd"}>
        Platform and GMD index tokens.
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        mt={"24px"}
        flexWrap={"wrap"}
      >
        <Panel>
          <Box maxWidth={"calc(100% - 210px)"} width={"100%"}>
            <PanelHeader>
              <GMXSVG mr={"8px"} />
              <Box>
                <Box lineHeight={"130%"}>GMD</Box>
                <Box fontSize={"12px"} color={"#a9a9b0"} lineHeight={"130%"}>
                  GMD
                </Box>
              </Box>
            </PanelHeader>
            <Divider />
            <PanelBody>
              {GMD.map((data) => {
                return (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    lineHeight={"19px"}
                  >
                    <Box color={"rgba(255, 255, 255, 0.7)"}>{data.text}</Box>
                    <Box>{data.value}</Box>
                  </Box>
                );
              })}
            </PanelBody>
          </Box>
          <Box margin={"-10px -10px -10px 15px"}>
            <PieChart width={210} height={210}>
              <Pie
                data={gmxDistributionData}
                cx={100}
                cy={100}
                innerRadius={73}
                outerRadius={80}
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
              >
                Distribution
              </text>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </Box>
        </Panel>
      </Box>
    </Box>
  );
};

const Divider = styled(Box)`
  height: 1px;
  background: #23263b;
  margin: 10.5px -15px;
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
    margin-bottom: 8px;
  }
  > div:last-child {
    margin-bottom: 16px;
  }
`;

const Panel = styled(Box)`
  padding: 15px 15px 18px;
  border: 1px solid #1e2136;
  border-radius: 4px;
  font-size: 15px;
  background: #16182e;
  width: 100%;
  max-width: calc(50% - 8px);
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    /* max-width: 500px; */
  }

  @media screen and (max-width: 1100px) {
    max-width: 100%;
  }
  @media screen and (max-width: 660px) {
    flex-direction: column;
    > div:nth-child(1) {
      max-width: 100%;
    }
  }
`;

const ArbitranSVG = styled(Box)`
  background: url("/icons/arbitran.svg");
  background-size: 100% 100%;
  width: 24px;
  height: 24px;
`;

const GMXSVG = styled(Box)`
  background: url("/icons/gmd.png");
  background-size: 100% 100%;
  width: 40px;
  height: 45px;
`;

export default Tokens;
