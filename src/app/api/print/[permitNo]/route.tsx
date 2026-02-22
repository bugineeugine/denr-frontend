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
    marginBottom: 5,
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#c2410c",
    paddingBottom: 8,
  },

  headerRight: {
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 65,
    height: 65,
  },

  qrSmall: {
    width: 70,
    height: 70,
  },

  headerTextContainer: {
    marginLeft: 15,
  },

  headerLine: {
    fontSize: 10,
  },

  statusSmall: {
    marginTop: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 8,
    color: "#fff",
    borderRadius: 4,
    textAlign: "center",
  },
  headerBold: {
    fontSize: 11,
    fontWeight: "bold",
  },

  titleContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  paragraph: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 10,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableLabel: {
    width: "25%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    fontWeight: "bold",
  },

  tableValue: {
    width: "70%",
    borderBottomWidth: 1,
    padding: 5,
  },

  /* SIGNATURE */
  signatureRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signatureBox: {
    width: "40%",
    borderTopWidth: 1,
    paddingTop: 5,
    textAlign: "center",
  },

  footerText: {
    marginTop: 10,
    fontSize: 9,
    textAlign: "center",
  },

  totals: {
    marginTop: 5,
    fontSize: 10,
  },

  /* WATERMARK */
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    fontSize: 80,
    color: "rgba(128,0,128,0.2)",
    transform: "rotate(-30deg)",
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
    landOwner: string;
    contactNumber: string;
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
const TableRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableLabel}>{label}</Text>
    <Text style={styles.tableValue}>{value}</Text>
  </View>
);
const PermitPdf = ({ data }: PermitProps) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src="http://localhost:3000/denr.png" />

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerBold}>Department of Environment and Natural Resources</Text>
              <Text style={styles.headerLine}>REGION IV-A CALABARZON</Text>
              <Text style={styles.headerLine}>Community Environment and Natural Resources Office</Text>
              <Text style={styles.headerLine}>Brgy. Duhat, Sta. Cruz, Laguna</Text>
              <Text style={styles.headerLine}>Tel.No.: (049) 536-3231 or 09668494254</Text>
              <Text style={styles.headerLine}>Email: cenrostacruz@denr.gov.ph</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Image
              style={styles.qrSmall}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${data.permit_no}.png`}
            />
            <Text style={[styles.statusSmall, getStatusStyle(data.status)]}>{data.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>TRANSPORT CERTIFICATE</Text>
          <Text style={styles.subtitle}>OF PLANTED TREES IN PRIVATE LANDS</Text>
        </View>

        <Text style={styles.paragraph}>
          This is to certify that the logs and/or derivatives contained in this shipment are planted trees from Private
          Forest Plantations.
        </Text>

        <View style={styles.table}>
          <TableRow label="Permit No." value={data.permit_no} />
          <TableRow label="Landowner" value={data.landOwner} />
          <TableRow label="Contact No." value={data.contactNumber} />
          <TableRow label="Species" value={data.species} />
          <TableRow label="Total Volume" value={data.estimatedVolumeQuantity} />
          <TableRow label="Conveyance / Plate No." value={data.typeConveyancePlateNumber} />
          <TableRow label="Consignee / Destination" value={data.consignee} />
          <TableRow label="Date of Transport" value={data.dateOfTransport} />

          <TableRow label="Issued Date" value={data.issued_date} />
          <TableRow label="Expiry Date" value={data.expiry_date} />
        </View>

        {/* <View style={styles.totals}>
          <Text>Grand Total: {data.estimatedVolumeQuantity}</Text>
        </View> */}

        <View style={styles.signatureRow}>
          <Text style={styles.signatureBox}>AUTHORIZED SIGNATURE</Text>
          <Text style={styles.signatureBox}>DATE CERTIFIED</Text>
        </View>

        <Text style={styles.footerText}>
          This certificate is issued pursuant to existing rules and regulations of the Department of Environment and
          Natural Resources (DENR).
        </Text>
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
