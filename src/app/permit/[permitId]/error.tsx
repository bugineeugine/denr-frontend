"use client";

import React from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const PermitError: React.FC<ErrorProps> = ({ error, reset }) => {
  console.error("Error caught in Error Boundary:", error);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Oops! Something went wrong.</h1>
      <p style={{ marginBottom: "1rem", color: "#555" }}>{error.message}</p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Try Again
      </button>
      <Link href="/" style={{ color: "#0070f3" }}>
        Go back home
      </Link>
    </div>
  );
};

export default PermitError;
