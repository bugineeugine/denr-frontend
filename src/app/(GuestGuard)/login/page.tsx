"use client";

import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, startTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import {
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Tab as MuiTab,
  Tabs as MuiTabs,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { AuthData } from "@/types/auth";

const schema = z.object({
  email: z.email({ error: "Invalid Email format" }).nonempty({ error: "Email is required" }),
  password: z.string().nonempty({ error: "Password is required" }),
});

const registerSchema = z.object({
  name: z.string().nonempty({ error: "Name is required" }),
  email: z.email({ error: "Invalid format email" }).nonempty({ error: "Email is required" }),
  password: z
    .string()
    .min(8, { error: "Password must contain at least 8 characters" })
    .max(55, { error: "Password must 55 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/])[A-Za-z\d@$!%*?&#/]+$/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

type RequestLoginType = z.infer<typeof schema>;
type RequestRsgisterType = z.infer<typeof registerSchema>;

const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 52,
  minWidth: 0,
  flex: 1,
  borderRadius: 999,
  textTransform: "none",
  fontSize: theme.typography.pxToRem(14),
  fontWeight: 700,
  letterSpacing: "0.01em",
  color: alpha(theme.palette.primary.main, 0.8),
  transition: "all 0.2s ease",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(1.25),
  },
  "&.Mui-selected": {
    color: theme.palette.primary.contrastText,
  },
}));

const TabLists = styled(MuiTabs)(({ theme }) => ({
  minHeight: 64,
  padding: 6,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,

  "& .MuiTabs-flexContainer": {
    gap: theme.spacing(1),
  },

  "& .MuiTabs-indicator": {
    height: "calc(100% - 12px)",
    borderRadius: 999,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    boxShadow: `0 14px 28px ${alpha(theme.palette.primary.dark, 0.2)}`,
    margin: 6,
    zIndex: 0,
  },

  // 👉 default tab color
  "& .MuiTab-root": {
    color: theme.palette.text.primary,
    zIndex: 1, // important para nasa ibabaw ng indicator
    transition: "color 0.3s ease",
  },

  // 👉 kapag active (selected)
  "& .MuiTab-root.Mui-selected": {
    color: "#fff",
  },
}));

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.9)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#fff",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(45, 80, 22, 0.08)",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.MuiInputLabel-shrink": {
      backgroundColor: "#fff",
      paddingInline: "4px",
      borderRadius: "4px",
    },
  },
};

const featureItems = [
  "Track and validate permit applications in one place.",
  "Secure role-based access for officers, validators, and administrators.",
  "Faster verification flow with clearer permit status handling.",
];

const inputBaseClass =
  "w-full rounded-2xl border border-white/60 bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200";

const submitButtonClass =
  "mt-auto w-full rounded-2xl bg-denr-green px-4 py-3.5 font-semibold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-denr-light-green disabled:cursor-not-allowed disabled:opacity-70";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { replace } = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "admin123@example.com",
      password: "P@$sw0rd",
    },
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation<
    { message: string; user: AuthData },
    AxiosError<{ message: string }>,
    RequestLoginType
  >({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/login`, data);
      return response.data;
    },
    onSuccess: (data) => {
      const role = data.user.role;

      if (role === "admin" || role === "validator" || role == "officer") {
        replace("/dashboard");
        return;
      }
      replace("/home");
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestLoginType) => {
    await mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="space-y-4">
        <FormControl fullWidth>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                value={value}
                onChange={onChange}
                type="text"
                id="email"
                label="Email address"
                name="email"
                placeholder="name@example.com"
                helperText={error?.message ?? "Use the account assigned to your role."}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon className="text-denr-light-green" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                helperText={error?.message ?? "Your credentials are transmitted securely."}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon className="text-denr-light-green" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-slate-600">
        Use your assigned email and password to access permit verification tools.
      </div>

      <button disabled={isPending} type="submit" name="login" className={submitButtonClass}>
        <span className="flex items-center justify-center gap-2">
          <WorkspacePremiumRoundedIcon fontSize="small" />
          {isPending ? "Signing in..." : "Sign In to Dashboard"}
        </span>
      </button>
    </form>
  );
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync, isPending } = useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    RequestRsgisterType
  >({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/register`, data);
      return response.data;
    },
    onSuccess: (response) => {
      customToast(response.message);
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestRsgisterType) => {
    await mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="space-y-4">
        <FormControl fullWidth>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                value={value}
                onChange={onChange}
                type="text"
                id="name"
                label="Full name"
                name="name"
                placeholder="Enter your full name"
                helperText={error?.message ?? "Enter the name that should appear in system records."}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon className="text-denr-light-green" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                value={value}
                onChange={onChange}
                type="text"
                id="register-email"
                label="Email address"
                name="email"
                placeholder="name@example.com"
                helperText={error?.message ?? "Use an active email address for account access."}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon className="text-denr-light-green" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth className="flex-1">
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                id="register-password"
                label="Password"
                name="password"
                placeholder="Create a secure password"
                helperText={error?.message ?? "Use uppercase, lowercase, number, and special character."}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon className="text-denr-light-green" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-slate-600">
        New accounts should use a strong password that satisfies the security policy.
      </div>

      <button disabled={isPending} type="submit" name="register" className={submitButtonClass}>
        <span className="flex items-center justify-center gap-2">
          <PersonAddAlt1RoundedIcon fontSize="small" />
          {isPending ? "Creating account..." : "Create Account"}
        </span>
      </button>
    </form>
  );
};

const LoginPage = () => {
  const [tabSwitch, setTabSwtch] = useState("login");

  const handleSwitchTab = (_event: React.SyntheticEvent, label: string) => {
    startTransition(() => {
      setTabSwtch(label);
    });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.28),_transparent_34%),linear-gradient(135deg,_#f5fbf3_0%,_#eef7eb_42%,_#e2f1dd_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid h-full w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_24px_80px_rgba(45,80,22,0.18)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden p-8 text-white lg:flex lg:h-full lg:flex-col xl:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,_rgba(26,61,25,0.95)_0%,_rgba(45,80,22,0.92)_48%,_rgba(74,124,89,0.88)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_24%)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center gap-4">
                <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-white/12 p-2 shadow-xl ring-1 ring-white/20 backdrop-blur">
                  <Image
                    src="/denr.png"
                    alt="DENR logo"
                    width={64}
                    height={64}
                    className="rounded-2xl bg-white p-1.5"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100/80">DENR CENRO</p>
                  <h1 className="mt-2 text-4xl font-semibold leading-tight text-white">
                    Centralized Permit Verification System
                  </h1>
                </div>
              </div>

              <div className="mt-8 max-w-lg space-y-4">
                <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50 backdrop-blur">
                  Built for secure permit review and agency coordination
                </span>
                <p className="text-base leading-7 text-emerald-50/86">
                  Access the platform used by DENR personnel to validate permits, manage records, and keep verification
                  workflows consistent across the office.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {featureItems.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-3xl border border-white/12 bg-white/10 px-5 py-4 backdrop-blur-sm"
                  >
                    <div className="mt-0.5 rounded-2xl bg-white/14 p-2">
                      <WorkspacePremiumRoundedIcon fontSize="small" />
                    </div>
                    <p className="text-sm leading-6 text-emerald-50/88">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto grid gap-3 pt-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">System Status</p>
                  <p className="mt-3 text-2xl font-semibold">Operational</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                    Auth access and permit verification modules are ready for use.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">User Roles</p>
                  <p className="mt-3 text-2xl font-semibold">Admin, Validator, Officer</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                    Role-based redirects remain intact after authentication.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex h-full items-center overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-xl">
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <Link href="/" className="inline-flex items-center gap-3">
                  <Image
                    src="/denr.png"
                    alt="DENR logo"
                    width={52}
                    height={52}
                    className="rounded-2xl bg-white p-1.5 shadow"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-denr-light-green">DENR CENRO</p>
                    <p className="text-sm font-medium text-slate-700">Permit Verification System</p>
                  </div>
                </Link>
              </div>

              <Paper
                variant="outlined"
                className="rounded-[2rem] border-white/80 bg-white/82 p-5 shadow-none backdrop-blur-md sm:p-8"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-denr-light-green">
                      Secure Access
                    </span>
                    <div>
                      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {tabSwitch === "login" ? "Welcome back" : "Create your account"}
                      </h2>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                        {tabSwitch === "login"
                          ? "Sign in to continue managing permit verification workflows."
                          : "Register a new account to access the permit verification portal."}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-denr-green"
                  >
                    <HomeRoundedIcon fontSize="small" />
                    Back to home
                  </Link>
                </div>

                <div className="mb-4 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-2">
                  <TabLists
                    value={tabSwitch}
                    onChange={handleSwitchTab}
                    aria-label="Authentication tab switcher"
                    variant="fullWidth"
                  >
                    <Tab
                      iconPosition="start"
                      icon={<PersonOutlineOutlinedIcon fontSize="small" />}
                      label="Login"
                      value="login"
                    />
                    <Tab
                      iconPosition="start"
                      icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                      label="Register"
                      value="register"
                    />
                  </TabLists>
                </div>

                <Activity mode={tabSwitch === "login" ? "visible" : "hidden"}>
                  <LoginForm />
                </Activity>
                <Activity mode={tabSwitch === "register" ? "visible" : "hidden"}>
                  <RegisterForm />
                </Activity>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/85 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-2 text-denr-green shadow-sm">
                      <WorkspacePremiumRoundedIcon fontSize="small" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Protected access</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Keep credentials private. The system redirects users based on their assigned role after
                        successful authentication.
                      </p>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
