"use client";
import { useState } from "react";
import { Box, Fab, IconButton, TextField, Button, Typography, Paper } from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CloseIcon from "@mui/icons-material/Close";

type Message = {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
};
const LoadingDots = () => {
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          bgcolor: "grey.500",
          borderRadius: "50%",
          animation: "bounce 1.2s infinite",
          animationDelay: "0s",
        }}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          bgcolor: "grey.500",
          borderRadius: "50%",
          animation: "bounce 1.2s infinite",
          animationDelay: "0.2s",
        }}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          bgcolor: "grey.500",
          borderRadius: "50%",
          animation: "bounce 1.2s infinite",
          animationDelay: "0.4s",
        }}
      />

      {/* Keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};
const Chat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", parts: [{ text: input }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    setLoading(true);
    const loadingMsg: Message = { role: "model", parts: [{ text: "" }] };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: newMessages }),
      });

      const data = await res.json();
      const aiMsg: Message = { role: "model", parts: [{ text: data.answer }] };

      setMessages((prev) => [...prev.slice(0, -1), aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "model", parts: [{ text: "Error: Could not get AI response." }] },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Fab color="primary" aria-label="chat" className="fixed bottom-5 right-5" onClick={() => setOpen(true)}>
        <CommentOutlinedIcon />
      </Fab>

      {open && (
        <Paper
          className="fixed bottom-20 right-10 z-1000"
          sx={{
            width: 400,
            height: 500,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">Chat</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: msg.role === "user" ? "primary.main" : "grey.200",
                  color: msg.role === "user" ? "white" : "black",
                  p: 1,
                  borderRadius: 1,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.role === "model" && msg.parts[0].text === "" ? <LoadingDots /> : msg.parts[0].text}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", p: 1, gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type a message..."
              multiline
              maxRows={6} // maximum height ng TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button variant="contained" onClick={handleSend} disabled={loading}>
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Chat;
