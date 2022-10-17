/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

let timerid = null;
let downtime = 0;
const CountDown = ({ date }) => {
  const [text, setText] = useState("");
  const setDate = () => {
    let _text = "";
    const _date = Math.max(date - downtime, 0);
    const day = Math.floor(_date / 86400);
    if (day > 0) _text += day + "D";
    const hour = Math.floor((_date % 86400) / 3600);
    if (!(day === 0 && hour === 0)) _text += ` ${hour}H`;
    const minute = Math.floor(((_date % 86400) % 3600) / 60);
    if (!(day === 0 && hour === 0 && minute === 0)) _text += ` ${minute}M`;
    const second = _date % 60;
    _text += ` ${second}S`;
    setText(_text);
  };
  useEffect(() => {
    setDate();
    downtime = 0;
    if (timerid) clearInterval(timerid);
    timerid = setInterval(() => {
      setDate();
      downtime++;
    }, 1000);
  }, [date]);
  return <StyledContainer>{text}</StyledContainer>;
};

const StyledContainer = styled(Box)``;

export default CountDown;
