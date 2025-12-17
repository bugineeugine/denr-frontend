import { useDisclosure } from "@/hooks/useDisclosure";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { PermitDataType } from "@/types/permit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import History from "../Timeline/History";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { MapContainer } from "react-leaflet/MapContainer";
import Paper from "@mui/material/Paper";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { SyntheticEvent, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import useAuth from "@/store/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";

const DisplayFileContent = ({ permit }: { permit: PermitDataType }) => {
  const documents = [
    {
      title: "Request Letter",
      path: permit.requestLetter,
    },
    {
      title: "Barangay Certificate",
      path: permit.certificateBarangay,
    },
    {
      title: "OR/CR",
      path: permit.orCr,
    },
    {
      title: "Driver License",
      path: permit.driverLicense,
    },
    permit.otherDocuments
      ? {
          title: "Other Documents",
          path: permit.otherDocuments,
        }
      : {},
  ];

  return documents.map((value) => {
    return (
      <Card variant="outlined" key={value.title}>
        <CardHeader title={value.title} />
        <CardMedia
          className="h-screen"
          component="iframe"
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${value.path}#toolbar=0&navpanes=0&scrollbar=0`}
          style={{ width: "100%", border: "none" }}
        />
      </Card>
    );
  });
};

const PermitDrawer = ({ permit }: { permit: PermitDataType }) => {
  const disclosure = useDisclosure();
  const [first, last] = permit.creator.name.split(" ");
  const email = permit.creator.email;
  const [value, setValue] = useState("details");
  const queryClient = useQueryClient();
  const userData = useAuth((state) => state.userData);
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
      <Drawer
        className="z-[calc(var(--mui-zIndex-drawer)+1)] "
        open={disclosure.isOpen}
        anchor="right"
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "100%",
                sm: 500,
                md: 800,
                lg: 1200,
              },
            },
          },
        }}
      >
        <Box className="overflow-hidden border-b p-3 border-b-divider flex items-center justify-between">
          <Box className="flex items-center gap-1">
            <Button
              className="min-w-0 bg-background-paper border border-transparent hover:border-divider text-gray-500 hover:bg-action-hover"
              onClick={disclosure.onClose}
            >
              <KeyboardDoubleArrowRightOutlinedIcon />
            </Button>

            <Typography variant="subtitle2">
              App No #. <Typography component="span">{permit.permit_no}</Typography>
            </Typography>
          </Box>
          <Box className="space-x-1">
            <Chip
              size="small"
              label={permit.status}
              className=" capitalize'"
              color={
                permit.status === "Active"
                  ? "info"
                  : permit.status === "Expired"
                    ? "error"
                    : permit.status === "Cancelled"
                      ? "warning"
                      : "primary"
              }
            />
          </Box>
        </Box>

        <Box className="p-2 overflow-auto h-full">
          <Grid container spacing={1}>
            <Grid size={8}>
              <Box className="flex flex-col gap-2">
                <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                  <Tab value="details" label="Details" />
                  <Tab value="files" label="Files" />
                </Tabs>
                {value === "details" && (
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
                {value === "files" && (
                  <Box className=" space-y-2">
                    <DisplayFileContent permit={permit} />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid size={4}>
              <History permit={permit} />
            </Grid>
          </Grid>
        </Box>
        <Box className="p-2">
          {userData?.role === "officer" && (
            <Button onClick={handleApprove} loading={isPending} variant="contained">
              Approve
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default PermitDrawer;
