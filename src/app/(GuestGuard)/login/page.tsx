"use client";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { Activity, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

import { startTransition } from "react";

import { alpha, styled } from "@mui/material/styles";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MuiTabList from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { FormControl, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { AuthData } from "@/types/auth";

const Tab = styled(MuiTab)(({ theme }) => {
  return {
    minHeight: 48,
    flexDirection: "row",
    marginRight: 3,
    "& svg": {
      marginBottom: "0 !important",
      marginRight: theme.spacing(3),
    },
  };
});

const TabLists = styled(MuiTabList)(({ theme }) => {
  return {
    "& .MuiTabs-scrollButtons.Mui-disabled": {
      opacity: 0.3,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
      height: "80%",
      borderRadius: 5,
      marginBottom: "9px !important",
      zIndex: 0,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "& .MuiTab-root": {
      minHeight: 40,
      minWidth: 120,
      zIndex: 1,
      textTransform: "none",
      fontWeight: 500,

      "&.Mui-selected": {
        color: theme.palette.primary.contrastText,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      "&:not(.Mui-selected)": {
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  };
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { replace } = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "admin@example.com",
      password: "admin123",
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

      if (role === "admin" || role === "validator") {
        replace("/dashboard");
        return;
      }
      replace("/home");
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: RequestLoginType) => {
    await mutateAsync(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  space-y-3 h-[350px]">
      {/* Username Field */}
      <FormControl fullWidth>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  type="text"
                  id="email"
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  helperText={error?.message}
                />
              </>
            );
          }}
        />
      </FormControl>
      {/* Password Field */}
      <FormControl fullWidth>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  helperText={error?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" color="inherit" onClick={handleShowPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </>
            );
          }}
        />
      </FormControl>
      {/* Login Button */}
      <button
        disabled={isPending}
        type="submit"
        name="login"
        className="w-full bg-denr-green hover:bg-denr-light-green text-white font-semibold py-3 px-4 rounded-lg
               transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-2 focus:ring-denr-green focus:ring-offset-2
               mt-auto"
      >
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Sign In
        </span>
      </button>
    </form>
  );
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: RequestRsgisterType) => {
    await mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  space-y-3 h-[350px]">
      <FormControl fullWidth>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  type="text"
                  id="name"
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  helperText={error?.message}
                />
              </>
            );
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  type="text"
                  id="email"
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  helperText={error?.message}
                />
              </>
            );
          }}
        />
      </FormControl>
      <FormControl fullWidth className="flex-1">
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  helperText={error?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" color="inherit" onClick={handleShowPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </>
            );
          }}
        />
      </FormControl>

      {/* Login Button */}
      <button
        disabled={isPending}
        type="submit"
        name="login"
        className="w-full bg-denr-green hover:bg-denr-light-green text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-denr-green focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Register
        </span>
      </button>
    </form>
  );
};

const LoginPage = () => {
  const [tabSwitch, setTabSwtch] = useState("login");

  const handleSwitchTab = (event: React.SyntheticEvent, label: string) => {
    startTransition(() => {
      setTabSwtch(label);
    });
  };

  return (
    <div className="bg-linear-to-br from-green-50 to-emerald-100 min-h-screen flex items-center justify-center p-4">
      <>
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-denr-green rounded-full mb-4 shadow-lg">
              <Image
                src="/denr.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto mb-4 rounded-full bg-white p-2"
              />
            </div>
            <h1 className="text-3xl font-bold text-denr-green mb-2">DENR - CENRO</h1>
            <p className="text-gray-600 text-sm">Centralized Permit Verification System</p>
          </div>
          <TabLists value={tabSwitch} onChange={handleSwitchTab} aria-label="resident-details" variant="fullWidth">
            <Tab iconPosition="start" icon={<PersonOutlineOutlinedIcon />} label="Login" value={"login"} />
            <Tab iconPosition="start" icon={<ErrorOutlineOutlinedIcon />} label="Register" value={"register"} />
          </TabLists>
          <Paper variant="outlined" className="rounded-2xl   shadow-2xl p-8 border border-green-200 h-[500px]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-center text-sm">
                {" "}
                {tabSwitch === "login" ? "Please sign in to your account" : "Register Account"}{" "}
              </p>
            </div>
            <Activity mode={tabSwitch === "login" ? "visible" : "hidden"}>
              <LoginForm />
            </Activity>
            <Activity mode={tabSwitch === "register" ? "visible" : "hidden"}>
              <RegisterForm />
            </Activity>

            {/* Additional Links */}
            {/* <div className="mt-8 p-4 bg-opacity-10 border border-green-500 border-opacity-20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Demo Credentials:</h4>
              <div className="text-xs text-green-500 space-y-1">
                <div>
                  Username: <span className="font-mono bg-opacity-10 px-1 rounded">admin</span> | Password:{" "}
                  <span className="font-mono bg-opacity-10 px-1 rounded">admin123</span>
                </div>
                <div>
                  Username: <span className="font-mono bg-opacity-10 px-1 rounded">validator</span> | Password:{" "}
                  <span className="font-mono bg-opacity-10 px-1 rounded">validator</span>
                </div>
              </div>
            </div> */}
          </Paper>

          {/* <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm text-green-700 font-medium">System Online</span>
            </div>
          </div>
        
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-denr-green transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div> */}
        </div>
      </>
    </div>
  );
};

export default LoginPage;
