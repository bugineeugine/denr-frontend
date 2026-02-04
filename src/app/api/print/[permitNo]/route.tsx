import axiosInstance from "@/utils/axiosInstance";
import { Page, Text, View, Document, StyleSheet, Image, renderToStream } from "@react-pdf/renderer";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const getStatusStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return { backgroundColor: "#0284c7" }; // info (blue)
    case "Expired":
      return { backgroundColor: "#dc2626" }; // error (red)
    case "Rejected":
      return { backgroundColor: "#f59e0b" }; // warning (orange)
    default:
      return { backgroundColor: "#2563eb" }; // primary
  }
};
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 6,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    width: "60%",
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  qr: {
    width: 120,
    height: 120,
  },
  status: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#fff",
    borderRadius: 6,
    textAlign: "center",
    width: 100,
  },
});
const errorStyles = StyleSheet.create({
  page: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  code: {
    fontSize: 12,
    color: "#6b7280",
  },
});
interface PermitProps {
  data: {
    permit_type: string;
    permit_no: string;
    typeForestProduct: string;
    estimatedVolumeQuantity: string;
    typeConveyancePlateNumber: string;
    consignee: string;
    species: string;
    dateOfTransport: string;
    expiry_date: string;
    issued_date: string;
    status: string;
  };
}
const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const PermitNotFoundPdf = () => (
  <Document>
    <Page style={errorStyles.page}>
      <Text style={errorStyles.title}>Application NOT FOUND</Text>
      <Text style={errorStyles.message}>
        The application number you are trying to access does not exist or has been removed.
      </Text>
      <Text style={errorStyles.code}>Error Code: APPLICATION_NOT_FOUND</Text>
    </Page>
  </Document>
);
const PermitUnauthorize = () => (
  <Document>
    <Page style={errorStyles.page}>
      <Text style={errorStyles.title}>UNAUTHORIZED ACCESS</Text>
      <Text style={errorStyles.message}>
        You are not authorized to view this permit. Please ensure you are logged in and have the correct permissions.
      </Text>
      <Text style={errorStyles.code}>Error Code: UNAUTHORIZED_ACCESS</Text>
    </Page>
  </Document>
);
const SomethingWentWrongPdf = () => (
  <Document>
    <Page style={errorStyles.page}>
      <Text style={errorStyles.title}>SOMETHING WENT WRONG</Text>
      <Text style={errorStyles.message}>
        We encountered an unexpected error while generating this permit. Please try again later.
      </Text>
      <Text style={errorStyles.code}>Error Code: INTERNAL_ERROR</Text>
    </Page>
  </Document>
);
const PermitPdf = ({ data }: PermitProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>TRANSPORT PERMIT</Text>
        <Text style={styles.subtitle}>Permit No: {data.permit_no}</Text>

        <View style={styles.table}>
          <Row label="Permit Type" value={data.permit_type} />
          <Row label="Forest Product" value={data.typeForestProduct} />
          <Row label="Species" value={data.species} />
          <Row label="Estimated Volume" value={data.estimatedVolumeQuantity} />
          <Row label="Conveyance / Plate No." value={data.typeConveyancePlateNumber} />
          <Row label="Consignee / Destination" value={data.consignee} />
          <Row label="Date of Transport" value={data.dateOfTransport} />
          <Row label="Issued Date" value={data.issued_date} />
          <Row label="Expiry Date" value={data.expiry_date} />
        </View>

        <View style={styles.qrContainer}>
          <Image
            style={styles.qr}
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${data.permit_no}.png`}
          />
          <Text style={[styles.status, getStatusStyle(data.status)]}>{data.status.toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(request: Request, { params }: { params: Promise<{ permitNo: string }> }) {
  const { permitNo } = await params;
  const cookiStore = await cookies();
  try {
    if (!cookiStore.get("accessToken")?.value) {
      const stream = await renderToStream(<PermitUnauthorize />);
      return new NextResponse(stream as unknown as ReadableStream, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    }
    const permit = await axiosInstance.get("/permits/find/" + permitNo);
    if (permit.data.data.status !== "Approved") {
      const stream = await renderToStream(<PermitNotFoundPdf />);
      return new NextResponse(stream as unknown as ReadableStream, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    }
    const stream = await renderToStream(<PermitPdf data={permit.data.data} />);
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        const stream = await renderToStream(<PermitNotFoundPdf />);
        return new NextResponse(stream as unknown as ReadableStream, {
          headers: {
            "Content-Type": "application/pdf",
          },
        });
      }
    }
    const stream = await renderToStream(<SomethingWentWrongPdf />);
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  }
}
