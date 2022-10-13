import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import Davatar from "@davatar/react";

const Button = ({
  width,
  height,
  type,
  fontSize = "16px",
  children,
  disabled,
  onClick,
  color = "white",
  style,
  letterSpacing = "2px",
  account,
}) => {
  return (
    <>
      {type === "connect" ? (
        <ConnectButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
          letterSpacing={letterSpacing}
        >
          <Box display={"flex"} alignItems={"center"}>
            {account ? <Davatar size={20} address={account} /> : <ConnectSVG />}
            <Box>{children}</Box>
          </Box>
        </ConnectButton>
      ) : type === "disconnect" ? (
        <DisconnectButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
          letterSpacing={letterSpacing}
        >
          {children}
        </DisconnectButton>
      ) : type === "primary" ? (
        <PrimaryButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
          letterSpacing={letterSpacing}
        >
          {children}
        </PrimaryButton>
      ) : type === "secondary" ? (
        <SecondaryButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
          letterSpacing={letterSpacing}
        >
          {children}
        </SecondaryButton>
      ) : (
        ""
      )}
    </>
  );
};

const ConnectSVG = styled(Box)`
  background-size: 100% 100%;
  background-image: url("/icons/connect.svg");
  width: 24px;
  height: 24px;
`;

const BaseButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Relative";
  font-size: ${({ fontSize }) => fontSize};
  font-weight: bold;
  min-width: ${({ width }) => width};
  min-height: ${({ height }) => height};
  max-width: ${({ width }) => width};
  max-height: ${({ height }) => height};
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  cursor: pointer;
  :disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ConnectButton = styled(BaseButton)`
  > div > div:nth-child(2) {
    font-weight: 400;
    font-size: 14px;
    margin-left: 8px;
    letter-spacing: 0;
  }
  border: 1px solid #ffffff29;
  border-radius: 4px;
  background: transparent;
  padding: 5px 14px;
  :hover {
    background: #808aff14;
  }
`;

const DisconnectButton = styled(BaseButton)`
  background: url("/images/disconnect.png");
  background-size: 100% 100%;
  :hover {
    filter: drop-shadow(0px 0px 10px rgb(190, 255, 87));
    transform: scale(1.02);
  }
`;

const PrimaryButton = styled(BaseButton)`
  margin: 6px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  letter-spacing: 0px;
  color: white;
  padding-left: 16px;
  padding-right: 16px;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  min-height: 36px;
  display: inline-flex !important;
  align-items: center;
  border: none;
  background: rgb(43, 55, 94);
  :hover {
    background: linear-gradient(
      90deg,
      rgb(58, 78, 252) 0%,
      rgb(51, 68, 222) 100%
    );
    box-shadow: 0 0 0.4rem 0.6rem rgb(45 66 252 / 20%);
  }
`;

const SecondaryButton = styled(BaseButton)`
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  letter-spacing: 0px;
  color: white;
  padding-left: 16px;
  padding-right: 16px;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  display: inline-flex !important;
  align-items: center;
  border: none;
  background: linear-gradient(
    90deg,
    rgb(45, 66, 252) 0%,
    rgb(46, 61, 205) 100%
  );
  :hover {
    background: linear-gradient(
      90deg,
      rgb(58, 78, 252) 0%,
      rgb(51, 68, 222) 100%
    );
    box-shadow: 0 0 0.4rem 0.6rem rgb(45 66 252 / 20%);
  }
`;

export default Button;
