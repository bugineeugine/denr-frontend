import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";

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
import { SyntheticEvent, useState } from "react";
import { Box, Card, CardHeader, CardMedia, FormHelperText, InputLabel, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import Comments from "./Comments";

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

  const handleChange = (_event: SyntheticEvent, newValue: DocumentKey) => {
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
    <Grid container spacing={2} sx={{ p: 3 }}>
      {uploadFields.map(({ name, label, required }) => {
        const file = watch(name);

        return (
          <Grid size={12} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#374151", mb: 0.75 }}
                  >
                    {label}{" "}
                    {required && <span style={{ color: "#ef4444" }}>*</span>}
                  </Typography>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: fieldState.error
                        ? "1.5px dashed #f87171"
                        : file
                          ? "1.5px solid #bbf7d0"
                          : "1.5px dashed #d1d5db",
                      background: file ? "#f0fdf4" : "#fafafa",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!file) (e.currentTarget as HTMLElement).style.borderColor = "#166534";
                    }}
                    onMouseLeave={(e) => {
                      if (!file) (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: file ? "#dcfce7" : "#f3f4f6",
                        flexShrink: 0,
                      }}
                    >
                      <UploadFileIcon sx={{ fontSize: 18, color: file ? "#166534" : "#9ca3af" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {file ? (
                        <>
                          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#166534", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {file.name}
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: 0 }}>
                            {(file.size / 1024).toFixed(1)} KB — click to replace
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", margin: 0 }}>
                            Click to upload
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0 }}>
                            PDF, JPG, PNG, GIF accepted
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] || null;
                        onChange(selectedFile);
                      }}
                    />
                  </label>

                  {fieldState.error && (
                    <FormHelperText error sx={{ mx: 1, mt: 0.5 }}>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const timberSpecies = ["Lumber (tabla)", "Plywood", "Veneer", "Particle Board", "Logs"];
const nonTimberSpecies = ["Rattan", "Bamboo", "Almaciga Resin", "Anahaw Palms", "Nipa"];

const PermitForm = ({ action }: { action?: string }) => {
  const { control, getValues, watch } = useFormContext<PermitSchemaType & { status: string }>();
  const [value, setVaueTabs] = useState(0);
  const typeForestProduct = watch("typeForestProduct");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setVaueTabs(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: "1.5px solid #e5e7eb",
          background: "#fff",
          px: 2,
          pt: 1,
        }}
      >
        <Tabs
          value={value}
          variant="fullWidth"
          onChange={handleChange}
          aria-label="permit form tabs"
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              textTransform: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#94a3b8",
              "&.Mui-selected": { color: "#166534", fontWeight: 700 },
            },
            "& .MuiTabs-indicator": {
              background: "linear-gradient(90deg, #14532d, #15803d)",
              height: 2.5,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab label="Basic Information" {...a11yProps(0)} />
          <Tab label="Upload Documents" {...a11yProps(1)} />
          {action === "edit" && <Tab label="Comments" {...a11yProps(2)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={2} sx={{ p: 3 }}>
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
              <InputLabel id="typeForestProduct-label">Type of Forest Product</InputLabel>
              <Controller
                name="typeForestProduct"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="typeForestProduct-label" label="Type of Forest Product">
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="Timber">Timber</MenuItem>
                    <MenuItem value="Non-Timber">Non-Timber</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="species-label">Species</InputLabel>
              <Controller
                name="species"
                control={control}
                render={({ field, fieldState }) => {
                  const options = typeForestProduct === "Timber" ? timberSpecies : typeForestProduct === "Non-Timber" ? nonTimberSpecies : [];
                  return (
                    <>
                      <Select {...field} labelId="species-label" label="Species" disabled={!typeForestProduct}>
                        <MenuItem value=""></MenuItem>
                        {options.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                    </>
                  );
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", mb: 0.5 }}>Estimated volume/quantity</FormLabel>
              <TextFieldForm name="estimatedVolumeQuantity" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Type of conveyance and plate number</FormLabel>
              <TextFieldForm name="typeConveyancePlateNumber" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Name and address of the consignee/destination</FormLabel>
              <TextFieldForm name="consignee" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Date of Transport</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dateOfTransport"
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
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Land Owner</FormLabel>
              <TextFieldForm name="landOwner" />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Contact Number</FormLabel>
              <Controller
                control={control}
                name="contactNumber"
                render={({ field: { value, onChange }, fieldState }) => (
                  <TextField
                    value={value}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                      onChange(digits);
                    }}
                    inputMode="numeric"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? `${(value as string)?.length ?? 0}/11 digits`}
                  />
                )}
              />
            </FormControl>
          </Grid>
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
