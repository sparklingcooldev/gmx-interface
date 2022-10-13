/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import hexToRgba from "hex-to-rgba";
import { useState } from "react";

const Tokens = ({ setNotification }) => {
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

  const md = useMediaQuery("(max-width : 1100px)");
  const sm = useMediaQuery("(max-width : 660px)");

  return (
    <Box mt={"31px"}>
      <Box display={"flex"} alignItems={"center"}>
        <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
          Tokens
        </Box>
        <ArbitranSVG ml={"10px"} />
      </Box>
      <Box fontSize={"15px"} lineHeight={"21px"} color={"#b7b7bd"}>
        Platform and GLP index tokens.
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
                <Box lineHeight={"130%"}>GMX</Box>
                <Box fontSize={"12px"} color={"#a9a9b0"} lineHeight={"130%"}>
                  GMX
                </Box>
              </Box>
            </PanelHeader>
            <Divider />
            <PanelBody>
              {["", "", "", ""].map((data) => {
                return (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    lineHeight={"19px"}
                  >
                    <Box color={"rgba(255, 255, 255, 0.7)"}>AUM</Box>
                    <Box>$632,428,439</Box>
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
        <Panel mt={md ? "15px" : 0}>
          <Box maxWidth={"calc(100% - 210px)"} width={"100%"}>
            <PanelHeader>
              <GLPSVG mr={"8px"}>
                <Box />
              </GLPSVG>
              <Box>
                <Box lineHeight={"130%"}>GLP</Box>
                <Box fontSize={"12px"} color={"#a9a9b0"} lineHeight={"130%"}>
                  GLP
                </Box>
              </Box>
            </PanelHeader>
            <Divider />
            <PanelBody>
              {["", "", "", "", ""].map((data) => {
                return (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    lineHeight={"19px"}
                  >
                    <Box color={"rgba(255, 255, 255, 0.7)"}>AUM</Box>
                    <Box>$632,428,439</Box>
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
                GLP Pool
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  .stats-label {
    font-size: 14px;
    line-height: 16px;
    border-radius: 4px;
    padding: 10px;
    letter-spacing: 0.4px;
    text-align: left;
    z-index: 1;
    background: linear-gradient(90deg, #0b0b0f 0%, rgba(10, 13, 28, 1) 100%);
    cursor: pointer;
  }

  .stats-label-color {
    width: 4px;
    height: 100%;
    margin-right: 15px;
  }
  max-width: calc(50% - 8px);
  @media screen and (max-width: 1100px) {
    max-width: 100%;
  }
  @media screen and (max-width: 660px) {
    flex-direction: column;
    >div:nth-child(1){
      max-width : 100%;
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
  background: url("/icons/gmx.svg");
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
`;

const GLPSVG = styled(Box)`
  background: url("/icons/glp.svg");
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
  position: relative;
  > div {
    position: absolute;
    background: url("/icons/arbitran.svg");
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
    right: 0;
    bottom: 0;
  }
`;

export default Tokens;
