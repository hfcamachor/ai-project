"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputWithIcon from "../components/Input";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

interface conversation {
  botMessage: string;
  userMessage: string;
}

export default function ChatAi(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [conversation, setConversation] = useState<conversation[]>([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMessages = async () => {
    setLoadingMessage(true);
    setInputMessage("");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputMessage,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      const dataMessage = data.choices[0].message.content;

      setConversation([
        ...conversation,
        {
          botMessage: dataMessage,
          userMessage: inputMessage,
        },
      ]);
      setLoadingMessage(false);
    } catch (error) {
      setLoadingMessage(false);
      console.log(error);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {["Chat Ai"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Response"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#166b4c",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Chat Ai
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          p: 3,
          width: "100%",
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            maxHeight: "calc(100vh - 40px)",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <div>
            {conversation.map((message, index) => {
              return (
                <div key={index}>
                  <Typography mt={3} variant="subtitle2" gutterBottom>
                    <strong>{message.userMessage}</strong>
                  </Typography>
                  <Typography pl={2} variant="body1" gutterBottom>
                    {message.botMessage}
                  </Typography>
                </div>
              );
            })}
            {loadingMessage && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress color="success" />
              </Box>
            )}
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <InputWithIcon
            inputChange={setInputMessage}
            inputMessage={inputMessage}
            handleKeyPress={getMessages}
          />
          <Button
            disabled={!inputMessage}
            onClick={getMessages}
            variant="contained"
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
