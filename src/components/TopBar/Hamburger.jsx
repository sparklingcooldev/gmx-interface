/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./menu.css";
import { Box } from "@mui/material";
import styled from "styled-components";

const Hamburger = ({ activePage, setActivePage }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        let form = document.getElementById("check");
        if (form) form.checked = false;
      }
    });
  }, []);

  const menus = ["Dashboard", "Earn", "Mint GMD", "Stake"];

  return (
    <nav role="navigation" style={{ background: "red" }}>
      <div id="menuToggle" ref={menuRef}>
        {/* A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it. */}

        <input type="checkbox" id="check" />

        {/* Some spans to act as a hamburger.
    
    They are acting like a real hamburger,
    not that McDonalds stuff. */}

        <span></span>
        <span></span>
        <span></span>

        {/* Too bad the menu has to be inside of the button
    but hey, it's pure CSS magic. */}
        <Menu id="menu">
          <StyledContainer>
            <Box
              display={"flex"}
              minWidth={"70px"}
              minHeight={"70px"}
              maxWidth={"70px"}
              maxHeight={"70px"}
            >
              <img src={"/logo.png"} width={"100%"} height={"100%"} alt={""} />
            </Box>
          </StyledContainer>
          <Box>
            <Menus active={activePage}>
              {menus.map((data, i) => {
                return (
                  <MenuItem
                    key={i}
                    to={`/${data.replace(" ", "").toLowerCase()}`}
                    index={i}
                    onClick={() => {
                      let form = document.getElementById("check");
                      if (form) form.checked = false;
                      setActivePage(i + 1);
                    }}
                  >
                    {data}
                  </MenuItem>
                );
              })}
            </Menus>
          </Box>
        </Menu>
      </div>
    </nav>
  );
};

const MenuItem = styled(Link)`
  font-size: 14px;
  line-height: 18px;
  font-weight: normal;
  letter-spacing: 0.1px;
  color: #a0a3c4 !important;
  transition: unset;
  padding: 15px 16px;
  text-decoration: none;
  display: block;
  :hover {
    background: rgba(48, 63, 208, 0.1411764706);
    color: white !important;
  }
  transition: unset !important;
`;

const Menus = styled(Box)`
  > a:nth-child(${({ active }) => active}) {
    background: rgba(48, 63, 208, 0.1411764706);
    color: white !important;
  }
`;

const StyledContainer = styled(Box)``;

const Menu = styled.ul`
  position: relative;
  overflow: hidden;
`;

export default Hamburger;
