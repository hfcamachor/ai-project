"use client";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import InputWithIcon from "../components/Input";
import { ThemeProvider } from "@emotion/react";

type Images = {
  url: string;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const imageSizes = [
  { label: "256x256" },
  { label: "512x512" },
  { label: "1024x1024" },
];

interface conversation {
  botImage: Images[];
  userMessage: string;
}

interface Sizes {
  labe: "";
}

export default function ImageGenerator() {
  const [images, setImages] = useState<Images[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [size, setSize] = useState("");
  const [sizeNeeded, setsSizeNeeded] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [conversation, setConversation] = useState<conversation[]>([]);

  useEffect(() => {
    if (size) {
      setsSizeNeeded(false);
    }
    if (inputMessage) {
      setInputError(false);
    }
  }, [size, inputMessage]);

  const getImages = async () => {
    if (!size || !inputMessage) {
      setsSizeNeeded(!size);
      setInputError(!inputMessage);
      return;
    }
    setsSizeNeeded(false);
    setInputMessage("");
    setLoadingImages(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputMessage,
        size,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/generations",
        options
      );
      const data = await response.json();
      setImages(data.data);
      setLoadingImages(false);
      setConversation([
        ...conversation,
        {
          botImage: data.data,
          userMessage: inputMessage,
        },
      ]);
    } catch (error) {
      console.log(error);
      setLoadingImages(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#101418",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            p={2}
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h1"
              color={"#bababa"}
              fontWeight={1}
              fontSize={30}
            >
              Image generator
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              height: "80vh",
              border: "solid 1px #797777",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "10px",
                borderBottom: "solid 1px #797777",
              }}
            >
              <InputWithIcon
                inputChange={setInputMessage}
                inputMessage={inputMessage}
                handleKeyPress={getImages}
                error={inputError}
              />
              <Button
                disabled={!inputMessage || !size}
                onClick={getImages}
                variant="contained"
              >
                <ArrowForwardIosIcon sx={{ color: "white" }} />
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={imageSizes}
                sx={{
                  width: "90%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: sizeNeeded ? "red" : "inherit",
                    },
                  },
                }}
                onChange={(event, newValue) => {
                  setSize(newValue ? newValue?.label : "");
                }}
                renderInput={(params) => <TextField {...params} label="Size" />}
              />
            </Box>
            <Box
              sx={{
                overflow: "auto",
                height: "calc(100% - 125px)",
              }}
            >
              {loadingImages && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress color="success" />
                </Box>
              )}
              {conversation.map((message, index) => {
                return (
                  <Box p={3} key={index}>
                    <Typography
                      sx={{ color: "white" }}
                      mt={3}
                      variant="subtitle2"
                      gutterBottom
                    >
                      {message.userMessage}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {!!images &&
                        message.botImage.map((dataImage, index) => {
                          return (
                            <Box key={index} p={1}>
                              <Image
                                src={dataImage.url}
                                alt={`Image Generatet ${index + 1}`}
                                width={400}
                                height={400}
                                loading="lazy"
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
