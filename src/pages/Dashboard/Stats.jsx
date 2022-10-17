/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import useTokenInfo from "../../hooks/useTokenInfo";
import { numberWithCommas } from "../../utils/functions";

const Stats = ({ setNotification }) => {
  const md = useMediaQuery("(max-width : 900px)");
  const { totalUSDValuts, GLPinVault, GLPPrice, totalFees, GLPbackingNeeded } =
    useTokenInfo();

  const overviews = [
    {
      text: "AUM",
      value: totalUSDValuts,
    },
    {
      text: "GLP managed",
      value: GLPPrice * GLPinVault,
    },
    {
      text: "Total Fees",
      value: totalFees,
    },
  ];

  const assets = [
    { text: "GLP backing needed", value: GLPbackingNeeded * GLPPrice },
  ];
  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <Box fontSize={"34px"} mb={"8px"} fontWeight={"bold"}>
          Stats
        </Box>
        <ArbitranSVG ml={"10px"} />
      </Box>
      <Box fontSize={"15px"} lineHeight={"21px"} color={"#b7b7bd"}>
        Arbitrum Total Stats start from 01 Sep 2021. <br />
        For detailed stats:{" "}
        <a
          href={""}
          target={"_blank"}
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          https://stats.gmx.io.
        </a>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        mt={"32px"}
        flexWrap={"wrap"}
      >
        <Panel>
          <PanelHeader>Overview</PanelHeader>
          <Divider />
          <PanelBody>
            {overviews.map((data, i) => {
              return (
                <Box
                  key={i}
                  display={"flex"}
                  justifyContent={"space-between"}
                  lineHeight={"130%"}
                >
                  <Box color={"rgba(255, 255, 255, 0.7)"}>{data.text}</Box>
                  <Box>${numberWithCommas(data.value.toFixed(5))}</Box>
                </Box>
              );
            })}
          </PanelBody>
        </Panel>
        <Panel mt={md ? "15px" : 0}>
          <PanelHeader>Asset stats</PanelHeader>
          <Divider />
          <PanelBody>
            {assets.map((data) => {
              return (
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  lineHeight={"130%"}
                >
                  <Box color={"rgba(255, 255, 255, 0.7)"}>{data.text}</Box>
                  <Box>${data.value.toFixed(5)}</Box>
                </Box>
              );
            })}
          </PanelBody>
        </Panel>
      </Box>
    </>
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
  justify-content: space-between;
`;

const PanelBody = styled(Box)`
  > div {
    margin-bottom: 8px;
  }
  > div:last-child {
    margin: 0;
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
  @media screen and (max-width: 900px) {
    max-width: 100%;
  }
`;

const ArbitranSVG = styled(Box)`
  background: url("/icons/arbitran.svg");
  background-size: 100% 100%;
  width: 24px;
  height: 24px;
`;

export default Stats;
