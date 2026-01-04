import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { useMapEvents } from "react-leaflet";

import { TileLayer } from "react-leaflet/TileLayer";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Controller, useFormContext } from "react-hook-form";
import { PermitSchemaType } from "@/types/permit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { SyntheticEvent, useEffect, useState } from "react";
import { Box, Button, Card, CardHeader, CardMedia, FormHelperText, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import Comments from "./Comments";
import useAuth from "@/store/useAuth";
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const TextFieldForm = ({ name }: { name: string }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        return (
          <TextField
            value={value}
            onChange={onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        );
      }}
    />
  );
};

const MapProvider = () => {
  const { getValues, setValue } = useFormContext<PermitSchemaType>();
  const [position, setPosition] = useState<[number, number]>([getValues("lat"), getValues("lng")]);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setValue("lat", lat);
      setValue("lng", lng);
    },
  });
  return <Marker position={position}></Marker>;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MapMarker = () => {
  const { getValues } = useFormContext<PermitSchemaType>();
  const lat = getValues("lat") ?? 0;
  const lng = getValues("lng") ?? 0;

  return (
    <MapContainer center={[lat, lng]} zoom={6} scrollWheelZoom={true} style={{ height: "50vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapProvider />
    </MapContainer>
  );
};

const DisplayFileContent = () => {
  const { getValues } = useFormContext<PermitSchemaType & { status: string }>();
  type DocumentKey = keyof typeof documents;
  const documents = {
    one: {
      title: "Request Letter",
      path: getValues("requestLetter"),
    },
    two: {
      title: "Barangay Certificate",
      path: getValues("certificateBarangay"),
    },
    three: {
      title: "OR/CR",
      path: getValues("orCr"),
    },
    four: {
      title: "Driver License",
      path: getValues("driverLicense"),
    },
    five: {
      title: "Other Documents",
      path: getValues("otherDocuments"),
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

const FileUploadContent = () => {
  const { control, watch } = useFormContext<PermitSchemaType & { status: string }>();

  const uploadFields = [
    { name: "requestLetter", label: "Request Letter", required: true },
    { name: "certificateBarangay", label: "Barangay Certificate", required: true },
    { name: "orCr", label: "OR/CR", required: true },
    { name: "driverLicense", label: "Driver's License", required: true },
    { name: "otherDocuments", label: "Other Supporting Documents (Optional)", required: false },
  ] as const;

  return (
    <Grid container spacing={2} className="p-4">
      {uploadFields.map(({ name, label, required }) => {
        const file = watch(name);

        return (
          <Grid size={12} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {label} {required && "*"}
                  </Typography>

                  <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }} startIcon={<UploadFileIcon />}>
                    Choose File
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] || null;
                        onChange(selectedFile);
                      }}
                    />
                  </Button>

                  {file && (
                    <Typography sx={{ mt: 1 }} variant="caption">
                      📄 {file.name}
                    </Typography>
                  )}

                  {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const PermitForm = ({ action }: { action?: string }) => {
  const userData = useAuth((state) => state.userData);
  const { control, getValues } = useFormContext<PermitSchemaType & { status: string }>();
  const [value, setVaueTabs] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setVaueTabs(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} variant="fullWidth" onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Bsic Information" {...a11yProps(0)} />

          <Tab label="Upload File" {...a11yProps(1)} />
          {action === "edit" && <Tab label="Comments" {...a11yProps(2)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={1} className="p-4">
          {getValues("status") && (
            <Grid size={12}>
              <FormControl fullWidth>
                <FormLabel>Staus</FormLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <>
                        <Select value={value} onChange={onChange}>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value={"Approved"}>Approved</MenuItem>
                          <MenuItem value={"Expired"}>Expired</MenuItem>
                          <MenuItem value={"Rejected"}>Rejected</MenuItem>
                        </Select>
                      </>
                    );
                  }}
                />
              </FormControl>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Landowner</FormLabel>
              <TextFieldForm name="land_owner" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Contact No.</FormLabel>
              <TextFieldForm name="contact_no" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Location</FormLabel>
              <TextFieldForm name="location" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Area (sq.m)</FormLabel>
              <TextFieldForm name="area" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Species</FormLabel>
              <TextFieldForm name="species" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Total Volume</FormLabel>
              <TextFieldForm name="total_volume" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Vehicle / Plate No.</FormLabel>
              <TextFieldForm name="plate_no" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Destination</FormLabel>
              <TextFieldForm name="destination" />
            </FormControl>
          </Grid>
          {userData?.role === "admin" && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Grand Total (cu.m)</FormLabel>
                  <TextFieldForm name="grand_total" />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Remaining Balance</FormLabel>
                  <TextFieldForm name="remaning_balance" />
                </FormControl>
              </Grid>
            </>
          )}

          {action === "edit" && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Issued Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="issued_date"
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => {
                      return (
                        <DatePicker
                          disableFuture
                          value={value ? dayjs(value) : null}
                          onChange={(e) => {
                            onChange(dayjs(e).format("MM/DD/YYYY"));
                          }}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              helperText: error?.message,
                              error: !!error,
                            },
                          }}
                        />
                      );
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          )}
          {action === "edit" && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Expiry Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="expiry_date"
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => {
                      return (
                        <DatePicker
                          value={value ? dayjs(value) : null}
                          onChange={(e) => {
                            onChange(dayjs(e).format("MM/DD/YYYY"));
                          }}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              helperText: error?.message,
                              error: !!error,
                            },
                          }}
                        />
                      );
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          )}

          <Grid size={12}>
            <MapMarker />
          </Grid>
        </Grid>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {action === "edit" ? <DisplayFileContent /> : <FileUploadContent />}
      </CustomTabPanel>

      {action === "edit" && (
        <CustomTabPanel value={value} index={2}>
          <Comments />
        </CustomTabPanel>
      )}
    </Box>
  );
};

export default PermitForm;
