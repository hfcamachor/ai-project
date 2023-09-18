import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function InputWithIcon() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      <TextField
        sx={{
          width: "100%",
        }}
        id="input-with-sx"
        label="With sx"
        variant="standard"
      />
    </Box>
  );
}
