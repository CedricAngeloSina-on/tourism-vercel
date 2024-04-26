import React from "react";
import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function TextfieldMain(props) {
  return (
    <div className="form">
      <TextField
        error={props.error}
        helperText={props.helper}
        label={props.label}
        variant="outlined"
        fullWidth
        onChange={props.change}
        value={props.value}
        type={props.type}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{props.sador}</InputAdornment>
          ),
        }}
      />
    </div>
  );
}

function TextfieldPass(props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div className="form">
      <TextField
        error={props.error}
        helperText={props.helper}
        label={props.label}
        variant="outlined"
        fullWidth
        onChange={props.change}
        value={props.value}
        type={showPassword ? "text" : "password"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{props.sador}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export { TextfieldMain, TextfieldPass };
