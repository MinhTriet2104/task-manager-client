import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CheckboxAutocomplete({ members, handleCombobox }) {
  const handleChange = (e, values) => {
    handleCombobox(values);
  };

  return (
    <Autocomplete
      multiple
      options={members}
      disableCloseOnSelect
      onChange={handleChange}
      getOptionLabel={(member) => member.username}
      renderOption={(member, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          <Avatar alt={member.username} src={member.avatar} />
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ marginLeft: "0.5em" }}
          >
            {member.username}
          </Typography>
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Asignees"
          placeholder="usernames..."
        />
      )}
    />
  );
}

export default CheckboxAutocomplete;
