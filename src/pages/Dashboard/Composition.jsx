/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import useTokenInfo from "../../hooks/useTokenInfo";
import { numberWithCommas } from "../../utils/functions";

const Stats = ({ setNotification }) => {
  const { pool } = useTokenInfo();

  const coins = [
    {
      url: "/icons/usdc.svg",
      name: "USDC",
      symbol: "USDC",
      price: `$${numberWithCommas(pool[0].price.toFixed(2))}`,
      pool: `$${numberWithCommas(pool[0].pool.toFixed(2))}`,
      weight: `${numberWithCommas(pool[0].weight.toFixed(2))}%`,
    },
    {
      url: "/icons/eth.svg",
      name: "Ethereum",
      symbol: "ETH",
      price: `$${numberWithCommas(pool[1].price.toFixed(2))}`,
      pool: `$${numberWithCommas(pool[1].pool.toFixed(2))}`,
      weight: `${numberWithCommas(pool[1].weight.toFixed(2))}%`,
    },
    {
      url: "/icons/bitcoin.svg",
      name: "Bitcoin",
      symbol: "BTC",
      price: `$${numberWithCommas(pool[2].price.toFixed(2))}`,
      pool: `$${numberWithCommas(pool[2].pool.toFixed(2))}`,
      weight: `${numberWithCommas(pool[2].weight.toFixed(2))}%`,
    },
  ];

  const md = useMediaQuery("(max-width : 1100px)");
  return (
    <>
      {!md ? (
        <Panel width={"100%"} mt={"15px"} mb={"50px"}>
          <PanelHeader>
            <Box>GMP Index Composition</Box>
            <ArbitranSVG />
          </PanelHeader>
          <Divider />
          <PanelBody>
            <TableHeader>
              <Box maxWidth={"300px"}>TOKEN</Box>
              <Box maxWidth={"110px"}>PRICE</Box>
              <Box maxWidth={"200px"}>POOL</Box>
              <Box maxWidth={"200px"}>WEIGHT</Box>
            </TableHeader>
            {coins.map((data) => {
              return (
                <TableHeader>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    maxWidth={"300px"}
                  >
                    <CoinSVG
                      style={{ background: `url(${data.url})` }}
                      mr={"8px"}
                    />
                    <Box>
                      <Box color={"white"}>{data.name}</Box>
                      <Box fontSize={"12px"}>{data.symbol}</Box>
                    </Box>
                  </Box>
                  <Box color={"#ffffffde!important"} maxWidth={"110px"}>
                    {data.price}
                  </Box>
                  <Box color={"#ffffffde!important"} maxWidth={"200px"}>
                    {data.pool}
                  </Box>
                  <Box color={"#ffffffde!important"} maxWidth={"200px"}>
                    {data.weight}
                  </Box>
                </TableHeader>
              );
            })}
          </PanelBody>
        </Panel>
      ) : (
        ""
      )}
      {md ? (
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mb={"35px"}
          mt={"15px"}
        >
          {coins.map((data, i) => {
            return (
              <Panel mb={"15px"}>
                <PanelHeader>
                  <CoinSVG
                    style={{
                      background: `url(${data.url})`,
                      backgroundSize: "100% 100%",
                    }}
                    mr={"8px"}
                    width={"20px"}
                    height={"20px"}
                  />
                  <Box>{data.symbol}</Box>
                </PanelHeader>
                <Divider />
                <PanelBody>
                  <Box>
                    <Box color={"rgba(255, 255, 255, 0.7)"}>Price</Box>
                    <Box>{data.price}</Box>
                  </Box>
                  <Box>
                    <Box color={"rgba(255, 255, 255, 0.7)"}>Pool</Box>
                    <Box>{data.pool}</Box>
                  </Box>
                  <Box>
                    <Box color={"rgba(255, 255, 255, 0.7)"}>Weight</Box>
                    <Box>{data.weight}</Box>
                  </Box>
                </PanelBody>
              </Panel>
            );
          })}
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

const CoinSVG = styled(Box)`
  width: 40px;
  height: 40px;
`;

const TableHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    padding: 12px;
    width: 100%;
    letter-spacing: 0.25px;
    color: #a9a9b0;
  }
  > div:first-child {
    padding-left: 15px;
  }
  > div:last-child {
    padding-right: 15px;
    text-align: right;
  }
`;

const ArbitranSVG = styled(Box)`
  background: url("/icons/arbitran.svg");
  background-size: 100% 100%;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  display: inline-flex;
  margin-left: 8px;
`;

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
  margin-left: -15px;
  margin-right: -15px;
  width: calc(100% + 31px);
  @media screen and (max-width: 1100px) {
    margin: 0;
    width: 100%;
    > div {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 8px;
      line-height: 130%;
    }
    > div:last-child {
      margin: 0;
    }
  }
`;

const Panel = styled(Box)`
  padding: 15px 15px 18px;
  border: 1px solid #1e2136;
  border-radius: 4px;
  font-size: 15px;
  background: #16182e;
  width: 100%;
  @media screen and (max-width: 1100px) {
    max-width: calc(50% - 8px);
  }
  @media screen and (max-width: 510px) {
    max-width: 100%;
  }
`;

export default Stats;
