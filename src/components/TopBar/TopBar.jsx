/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import { useEffect } from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import Hamburger from "./Hamburger";

function TopBar({ activePage, setActivePage, setNotification }) {
  const { connect, disconnect } = useWeb3Context();
  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }
  const account = useAddress();

  const ellipsis = account
    ? account.slice(0, 6) +
      "..." +
      account.substring(account.length - 5, account.length)
    : "Connect Wallet";

  useEffect(() => {
    const url = window.location.href;
    if (url.includes("dashboard")) setActivePage(1);
    if (url.includes("earn")) setActivePage(2);
  }, []);

  const menus = ["Dashboard", "Earn"];

  const sm = useMediaQuery("(max-width : 550px)");
  return (
    <StyledContainer>
      <Box display={"flex"} alignItems={"center"}>
        <Logo>
          <Box />
        </Logo>
        {!sm ? (
          <Menus active={activePage}>
            {menus.map((data, i) => {
              return (
                <Link
                  key={i}
                  to={`/${data.toLowerCase()}`}
                  onClick={() => setActivePage(i + 1)}
                >
                  {data}
                </Link>
              );
            })}
          </Menus>
        ) : (
          ""
        )}
      </Box>
      <Box mr={sm ? "30px" : 0}>
        <Button
          type={"connect"}
          width={"162px"}
          height={"36px"}
          onClick={() => (account ? disconnect() : onConnect())}
          account={account}
        >
          {ellipsis}
        </Button>
        {sm ? (
          <Hamburger activePage={activePage} setActivePage={setActivePage} />
        ) : (
          ""
        )}
      </Box>
    </StyledContainer>
  );
}

const Menus = styled(Box)`
  display: flex;
  > a {
    padding: 18px 17px;
    display: block;
    color: #a0a3c4;
    font-size: 15px;
    line-height: 18px;
    font-weight: normal;
  }
  > a:nth-child(${({ active }) => active}) {
    color: white;
  }
`;

const Logo = styled(Box)`
  font-size: 17px;
  padding: 15px;
  margin-left: -15px;
  display: flex;
  margin-right: 12px;
  height: fit-content;
  > div {
    background-image: url("/logotext.svg");
    background-size: 100% 100%;
    width: 83px;
    height: 22px;
    @media screen and (max-width: 550px) {
      background-image: url("/logo.svg");
      width: 29px;
      height: 22px;
    }
  }
`;

const StyledContainer = styled(Box)`
  height: 62px;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-left: 32px;
  padding-right: 32px;
  background: transparent 0% 0% no-repeat padding-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.062745098);
  letter-spacing: 0.5px;
  z-index: 100;
`;

export default TopBar;
