import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import useAuth from "@/store/useAuth";
import { useFormContext } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  user_id: string;
  permit_id: string;
  comment: string;
  created_at: string;
  user: {
    email: string;
    name: string;
  };
}

const Comments = () => {
  const [newComment, setNewComment] = useState("");
  const { getValues } = useFormContext();
  const listRef = useRef<HTMLUListElement>(null);
  const userData = useAuth((state) => state.userData);
  const pertmiId = getValues().id;
  const quereyClient = useQueryClient();
  const { data } = useQuery<Comment[]>({
    queryKey: ["comments", { pertmiId }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comments/${pertmiId}`);
      return response.data?.data;
    },
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      user_id: userData?.id as string,
      permit_id: pertmiId,
      comment: newComment,
    };

    await axiosInstance.post(`/comments/`, comment);
    quereyClient.invalidateQueries({
      queryKey: ["comments", { pertmiId }],
    });
    setNewComment("");
  };

  // Scroll to bottom whenever comments change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <Box
      className="p-4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "62vh", // adjust height as needed

        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Comments List */}
      <List
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {data?.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{comment.user.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle2">{comment.user.email}</Typography>}
                slotProps={{
                  secondary: {
                    component: "div",
                  },
                }}
                secondary={
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </>
                }
              />
            </ListItem>
            {index < data.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

      {/* Sticky Input */}
      <Box
        sx={{
          borderTop: "1px solid divider",

          position: "sticky",
          bottom: 0,
        }}
      >
        <TextField
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Button variant="contained" onClick={handleAddComment}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Comments;
