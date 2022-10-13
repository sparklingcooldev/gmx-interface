/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import Button from "../Button";

const Footer = () => {
  const socials = [
    {
      element: "/icons/twitter.svg",
      link: "#",
    },
    {
      element: "/icons/medium.svg",
      link: "#",
    },

    {
      element: "/icons/github.svg",
      link: "#",
    },
    {
      element: "/icons/telegram.svg",
      link: "#",
    },
    {
      element: "/icons/discord.svg",
      link: "#",
    },
  ];

  return (
    <StyledContainer>
      <LogoTextSVG mb={"24px"} />
      <Socials mb={"24px"}>
        {socials.map((data, i) => {
          return (
            <a href={data.link} target={"_blank"} rel="noreferrer">
              <img src={data.element} alt={""} />
            </a>
          );
        })}
      </Socials>
      <Kit>Media Kit</Kit>
    </StyledContainer>
  );
};

const Kit = styled.a`
  color: #a0a3c4;
  font-size: 15px;
  line-height: 18px;
  font-weight: normal;
  text-decoration: none;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

const Socials = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 420px;
  padding: 0px 40px;
  > a:hover {
    opacity: 0.9;
    > img {
      filter: brightness(0) invert(1);
    }
  }
`;

const LogoTextSVG = styled(Box)`
  background: url("/logotext.svg");
  background-size: 100% 100%;
  width: 115px;
  height: 26px;
`;

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  height: 200px;
  border-top: 1px solid #282b4c;
  background: #16182e;
`;

export default Footer;
