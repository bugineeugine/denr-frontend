"use client";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Controller, useFormContext } from "react-hook-form";
import { ViolationCreateInput } from "@/types/violation";

const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Open", "Investigating", "Resolved", "Dismissed"];
const TYPES = [
  "Illegal Logging",
  "Transport Without Permit",
  "Expired Permit Use",
  "Over-Quota Harvest",
  "Restricted Species",
  "Document Falsification",
  "Other",
];

const ViolationForm = () => {
  const { control, formState: { errors } } = useFormContext<ViolationCreateInput>();

  return (
    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
      <Controller
        name="violator_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Violator Name *"
            size="small"
            fullWidth
            error={!!errors.violator_name}
            helperText={errors.violator_name?.message as string}
          />
        )}
      />
      <Controller
        name="contact_number"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Contact Number" size="small" fullWidth />
        )}
      />
      <Controller
        name="violation_type"
        control={control}
        defaultValue="Illegal Logging"
        render={({ field }) => (
          <TextField {...field} select label="Violation Type *" size="small" fullWidth>
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="severity"
        control={control}
        defaultValue="Low"
        render={({ field }) => (
          <TextField {...field} select label="Severity *" size="small" fullWidth>
            {SEVERITIES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Location / Barangay" size="small" fullWidth />
        )}
      />
      <Controller
        name="date_recorded"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="date"
            label="Date Recorded *"
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.date_recorded}
            helperText={errors.date_recorded?.message as string}
          />
        )}
      />
      <Controller
        name="permit_id"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            label="Related Permit ID (optional)"
            size="small"
            fullWidth
          />
        )}
      />
      <Controller
        name="status"
        control={control}
        defaultValue="Open"
        render={({ field }) => (
          <TextField {...field} select label="Status" size="small" fullWidth>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <div className="md:col-span-2">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description *"
              size="small"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.description}
              helperText={errors.description?.message as string}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ViolationForm;
