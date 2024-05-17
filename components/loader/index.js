import React from "react";
import { CircularProgress } from '@material-ui/core';

const Loader = ({ show }) => (
  show ? <CircularProgress size={80} thickness={5} style={{'padding':'30px', 'textAlign':'center'}}/> : null
);

export default Loader
