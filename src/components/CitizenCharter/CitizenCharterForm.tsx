import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import { Controller, useFormContext } from "react-hook-form";
import { RequestCreateCitizenCharter } from "@/types/citizenCharter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
const FileUploadContent = () => {
  const { control, watch } = useFormContext<RequestCreateCitizenCharter & { status: string }>();

  const uploadFields = [
    {
      name: "requestLetter",
      label: "Request letter indicating the following: (1 original, 1 photocopy)",
      required: true,
    },
    {
      name: "barangayCertification",
      label: `Certification that the forest products are harvested within the area
of the owner (for non-timber) (1 original)
`,
      required: true,
    },
    { name: "treeCuttingPermit", label: "Approved Tree Cutting Permit for timber (1 photocopy) ", required: true },
    { name: "orCr", label: "OR/CR of conveyance and Driver’s License (1 photocopy) ", required: true },
    { name: "transportAgreement", label: "Certificate of Transport Agreement (1 original)", required: true },
    { name: "spa", label: "Special Power of Attorney (SPA) (1 original)", required: true },
  ] as const;

  return (
    <Grid container spacing={2}>
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

const CitizenCharterForm = () => {
  const { control } = useFormContext<RequestCreateCitizenCharter & { status: string }>();
  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <FormControl fullWidth>
          <FormLabel>Type Transaction</FormLabel>
          <Controller
            control={control}
            name="type_transaction"
            render={({ field: { value, onChange }, fieldState }) => {
              return (
                <>
                  <Select value={value} onChange={onChange} error={!!fieldState.error}>
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="G2B - Government to Business">G2B - Government to Business</MenuItem>
                    <MenuItem value="G2C - Government to Citizen">G2C - Government to Citizen</MenuItem>
                    <MenuItem value="G2G - Government to Government">G2G - Government to Government</MenuItem>
                  </Select>
                  {!!fieldState.error && (
                    <FormHelperText className="text-error">{fieldState.error.message}</FormHelperText>
                  )}
                </>
              );
            }}
          />
        </FormControl>
      </Grid>

      <Grid size={12}>
        <FileUploadContent />
      </Grid>
    </Grid>
  );
};

export default CitizenCharterForm;
