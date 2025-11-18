import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { UserSchemaType } from "@/types/user";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
const ValidPassword = () => {
  const { control } = useFormContext<UserSchemaType>();
  const password = useWatch({
    control,
    name: "password",
  });

  const isMinLength = password?.length >= 8 && password?.length <= 255;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const success = "text-[var(--mui-palette-success-main)]";
  const error = "text-[var(--mui-palette-error-main)]";
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="subtitle2">The Password must have</Typography>

      <Typography variant="body2" className={isMinLength ? success : error}>
        {isMinLength ? "✅" : "❌"} 8-255 Characters
      </Typography>

      <Typography variant="body2" className={hasNumber ? success : error}>
        {hasNumber ? "✅" : "❌"} At least one number
      </Typography>
      <Typography variant="body2" className={hasLowercase ? success : error}>
        {hasLowercase ? "✅" : "❌"} At least one lowercase letter
      </Typography>
      <Typography variant="body2" className={hasUppercase ? success : error}>
        {hasUppercase ? "✅" : "❌"} At least one uppercase letter
      </Typography>

      <Typography variant="body2" className={hasSpecialChar ? success : error}>
        {hasSpecialChar ? "✅" : "❌"} At least one special character
      </Typography>
    </div>
  );
};

const UserForm = () => {
  const { control } = useFormContext<UserSchemaType>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <FormControl fullWidth>
        <FormLabel>Name</FormLabel>
        <Controller
          control={control}
          name="name"
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
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Email</FormLabel>
        <Controller
          control={control}
          name="email"
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
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Role</FormLabel>
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange }, fieldState }) => {
            return (
              <>
                <Select value={value} onChange={onChange} error={!!fieldState.error}>
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="validator">Validator</MenuItem>
                </Select>
                {!!fieldState.error && (
                  <FormHelperText className="text-error">{fieldState.error.message}</FormHelperText>
                )}
              </>
            );
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Password</FormLabel>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, fieldState }) => {
            return (
              <TextField
                value={value}
                onChange={onChange}
                error={!!fieldState.error}
                type={showPassword ? "text" : "password"}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  },
                }}
              />
            );
          }}
        />
      </FormControl>
      <ValidPassword />
    </>
  );
};

export default UserForm;
