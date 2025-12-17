import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";

import { useDisclosure } from "@/hooks/useDisclosure";

import { PermitDataType } from "@/types/permit";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { MapContainer } from "react-leaflet/MapContainer";
import { Marker, Popup, TileLayer } from "react-leaflet";
import { useState, SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import React from "react";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import History from "../Timeline/History";
import useAuth from "@/store/useAuth";
import { customToast } from "@/utils/customToast";

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

export const Comments = ({ pertmiId }: { pertmiId: string }) => {
  const { data } = useQuery<Comment[]>({
    queryKey: ["comments", { pertmiId }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comments/${pertmiId}`);
      return response.data?.data;
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "62vh",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Comments List */}
      <List
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
    </Box>
  );
};

const DisplayFileContent = ({ permit }: { permit: PermitDataType }) => {
  type DocumentKey = keyof typeof documents;
  const documents = {
    one: {
      title: "Request Letter",
      path: permit.requestLetter,
    },
    two: {
      title: "Barangay Certificate",
      path: permit.certificateBarangay,
    },
    three: {
      title: "OR/CR",
      path: permit.orCr,
    },
    four: {
      title: "Driver License",
      path: permit.driverLicense,
    },
    five: {
      title: "Other Documents",
      path: permit.otherDocuments,
    },
  } as const;
  const [value, setValue] = useState<DocumentKey>("one");

  const handleChange = (event: SyntheticEvent, newValue: DocumentKey) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={1} className="p-4">
      <Grid size={3}>
        <Tabs value={value} orientation="vertical" onChange={handleChange} aria-label="wrapped label tabs example">
          <Tab value="one" label="Request Letter" />
          <Tab value="two" label="Barangay Certificate" />
          <Tab value="three" label="OR/CR" />
          <Tab value="four" label="Driver License" />
          <Tab value="five" label="Other Documents" />
        </Tabs>
      </Grid>
      <Grid size={9}>
        <Card variant="outlined">
          <CardHeader title={documents[value].title} />
          <CardMedia
            component="iframe"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${documents[value].path}#toolbar=0&navpanes=0&scrollbar=0`}
            style={{ width: "100%", border: "none", height: "100vh" }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

const ViewPermit = ({ permit }: { permit: PermitDataType }) => {
  const disclosure = useDisclosure();
  const userData = useAuth((state) => state.userData);
  const status = permit.status;
  const [first, last] = permit.creator.name.split(" ");
  const email = permit.creator.email;
  const [value, setValue] = useState("1");
  const queryClient = useQueryClient();
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put(`/permits/approve/${permit.permit_no}`);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["permits"],
      });
      customToast(response.message);
    },
    onError: () => {
      customToast("Someting went wrong", "error");
    },
  });

  const handleApprove = async () => {
    await mutateAsync();
    disclosure.onClose();
  };

  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="inherit">
        <RemoveRedEyeOutlinedIcon />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="edit-permit-dialog"
        aria-describedby="edit-permit"
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            className: "overflow-hidden",
          },
        }}
      >
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="edit-permit-dialog">
          <Box className="flex flex-col">
            <Box className="flex items-center gap-1">
              <Typography variant="subtitle2">{permit.permit_no}</Typography>
              <Chip
                size="small"
                label={status}
                color={
                  status === "Active"
                    ? "info"
                    : status === "Expired"
                      ? "error"
                      : status === "Cancelled"
                        ? "warning"
                        : "primary"
                }
              />
            </Box>
          </Box>
          <IconButton
            onClick={disclosure.onClose}
            size="small"
            aria-label="close"
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid size={8}>
              <Tabs
                value={value}
                variant="fullWidth"
                onChange={handleChange}
                aria-label="wrapped label tabs example"
                className="py-2"
              >
                <Tab value="1" label="Details" wrapped />
                <Tab value="2" label="Files" />
                <Tab value="3" label="Comments" />
              </Tabs>
              {value === "1" && (
                <Paper variant="outlined" className="p-3 flex gap-10   md:flex-row flex-col  ">
                  <Box className="flex flex-col w-full gap-3">
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Permit Type
                        </Typography>
                        <Typography className="text-md font-medium">{permit.permit_type}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Created By
                        </Typography>
                        <Chip
                          size="small"
                          avatar={<Avatar>{`${first[0].toUpperCase()}${last?.[0].toUpperCase() ?? ""}`}</Avatar>}
                          label={email}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Landowner
                        </Typography>
                        <Typography className="text-md font-medium">{permit.land_owner}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Contact No.
                        </Typography>
                        <Typography className="text-md font-medium">{permit.contact_no}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Location
                        </Typography>
                        <Typography className="text-md font-medium">{permit.location}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Area (sq.m)
                        </Typography>
                        <Typography className="text-md font-medium">{permit.area}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Species
                        </Typography>
                        <Typography className="text-md font-medium">{permit.species}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Total Volume
                        </Typography>
                        <Typography className="text-md font-medium">{permit.total_volume}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Vehicle / Plate No.
                        </Typography>
                        <Typography className="text-md font-medium">{permit.plate_no}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Destination
                        </Typography>
                        <Typography className="text-md font-medium">{permit.destination}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Grand Total (cu.m)
                        </Typography>
                        <Typography className="text-md font-medium">{permit.grand_total}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Remaining Balance
                        </Typography>
                        <Typography className="text-md font-medium">{permit.remaning_balance}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Issued Date
                        </Typography>
                        <Typography className="text-md font-medium">{permit.issued_date}</Typography>
                      </Grid>
                      <Grid size={"grow"}>
                        <Typography variant="subtitle1" className="text-xs text-gray-600">
                          Expiry Date
                        </Typography>
                        <Typography className="text-md font-medium">{permit.expiry_date}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid size={12} className="flex justify-center h-[200px] ">
                        <Avatar
                          alt="QR"
                          sx={{ height: 200, width: 200 }}
                          variant="square"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${permit.qrcode}`}
                        />
                      </Grid>
                      <Grid size={12}>
                        <MapContainer
                          center={[permit.lat, permit.lng]}
                          zoom={6}
                          scrollWheelZoom={true}
                          style={{ height: "50vh", width: "100%" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[permit.lat, permit.lng]}>
                            <Popup>{permit.permit_type}</Popup>
                          </Marker>
                        </MapContainer>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              )}
              {value === "2" && <DisplayFileContent permit={permit} />}
              {value === "3" && <Comments pertmiId={permit.id} />}
            </Grid>
            <Grid size={4}>
              <History permit={permit} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={disclosure.onClose} loading={isPending} variant="outlined" color="info">
            Close
          </Button>
          {userData?.role === "officer" && (
            <Button onClick={handleApprove} loading={isPending} variant="contained">
              Approve
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewPermit;
