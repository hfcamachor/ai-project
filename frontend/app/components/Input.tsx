import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";

export default function InputWithIcon({
  inputChange,
  inputMessage,
  handleKeyPress,
  error,
}: {
  inputChange: Dispatch<SetStateAction<string>>;
  handleKeyPress: () => void,
  inputMessage: string;
  error?: boolean
}) {

  const handleInputKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleKeyPress();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      <TextField
        error={error}
        sx={{
          width: "100%",
        }}
        id="input-with-sx"
        variant="standard"
        value={inputMessage}
        onChange={(e) => inputChange(e.target.value)}
        onKeyDown={(e) => handleInputKeyPress(e)}
      />
    </Box>
  );
}
