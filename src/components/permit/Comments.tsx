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

/* permitId prop is optional — when omitted, falls back to form context (EditPermit usage) */
const Comments = ({ permitId: permitIdProp }: { permitId?: string }) => {
  const [newComment, setNewComment] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const quereyClient = useQueryClient();

  /* Get permit id — prop takes priority, then form context */
  let pertmiId = permitIdProp ?? "";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useFormContext();
    if (!pertmiId) pertmiId = ctx?.getValues()?.id ?? "";
  } catch {
    /* no form context — that's fine when used from PermitDrawer */
  }

  const { data } = useQuery<Comment[]>({
    queryKey: ["comments", { pertmiId }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comments/${pertmiId}`);
      return response.data?.data;
    },
    enabled: !!pertmiId,
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await axiosInstance.post(`/comments/`, {
      permit_id: pertmiId,
      comment: newComment,
    });
    quereyClient.invalidateQueries({
      queryKey: ["comments", { pertmiId }],
    });
    setNewComment("");
  };

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
        height: "62vh",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Comments List */}
      <List ref={listRef} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {data?.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{comment.user.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle2">{comment.user.email}</Typography>}
                slotProps={{ secondary: { component: "div" } }}
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
      <Box sx={{ borderTop: "1px solid divider", position: "sticky", bottom: 0 }}>
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
