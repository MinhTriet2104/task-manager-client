import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

const Toolbar = styled.div`
  display: flex;
  align-items: center;

  height: 3rem;
  margin: 1rem;
`;

const IconLabel = styled.div`
  font-size: 2rem;

  margin-bottom: -2rem;
  padding: 10px;
`;

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "16px",
    marginLeft: "8px",
  },
}));

function FilterBar() {
  const classes = useStyles();

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const handleDateFromChange = (date) => {
    setDateFrom(date);
  };

  const handleDateToChange = (date) => {
    setDateTo(date);
  };

  return (
    <Toolbar>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          label="Date From:"
          value={dateFrom}
          onChange={handleDateFromChange}
        />
        <IconLabel>~</IconLabel>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          label="Date To:"
          value={dateTo}
          onChange={handleDateToChange}
        />
      </MuiPickersUtilsProvider>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={<SearchIcon />}
      >
        Search
      </Button>
    </Toolbar>
  );
}

export default FilterBar;
