import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { dateFormatter } from "@/utils/dateFormat";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { CheckCircle } from "@mui/icons-material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";

import { stringAvatar } from "@/utils/stringToColor";
import { PermitDataType } from "@/types/permit";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
const steps = [
  `Receiving/Releasing Clerk CENRO/Implementing PENRO Records Unit `,
  `PENR/CENR Officer/ Deputy CENR Officer `,
  `Chief RPS (CENRO)/Chief TSD (Implementing PENRO)`,
  `CENR Officer/Accountant for implementing PENRO`,
  `Bill Collector/ Cashier for implementing PENRO`,
  `Inspection Officer CENRO/Implementing PENRO`,
  `Chief RPS (CENRO)/Chief TSD (Implementing PENRO)`,
  "CENR/PENR Office",
  `Receiving/Releasing Clerk CENRO/Implementing PENRO Records Unit `,
];

export interface HistorySteps {
  message: string;
  data: Datum[];
}

export interface Datum {
  id: string;
  permit_id: string;
  action: string;
  approved_by: string;
  steps: number;
  created_at: Date;
  updated_at: Date;
  approver_name: string;
  email: string;
  permit_no: string;
  status: string;
}

const History = ({ permit }: { permit: PermitDataType }) => {
  const { data } = useQuery<HistorySteps, AxiosError<{ message: string }>>({
    queryKey: ["history-steps", { id: permit.id }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/permits/history/steps/${permit.id}`);
      return response.data;
    },
  });

  return (
    <Box className="h-full   ">
      <Timeline
        className="w-full max-w-[400px] px-2"
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          "& .MuiTimelineItem-root": {
            minHeight: "auto",
          },
        }}
      >
        {steps.map((history, index) => {
          const isLast = index === steps.length - 1;
          const findData = data?.data[index];

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={findData ? "success" : "warning"}>
                  {findData ? <CheckCircle /> : <CircleOutlinedIcon />}
                </TimelineDot>
                {!isLast && (
                  <TimelineConnector
                    sx={{
                      backgroundColor: "#e0e0e0",
                      width: "2px",
                      minHeight: "40px",
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent className="pb-2 ">
                <Card
                  elevation={2}
                  sx={{
                    borderLeft: `4px solid var(--mui-palette-info-main)`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      elevation: 4,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <CardContent className="p-4">
                    <Box className="flex justify-between items-start ">
                      <Box className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar
                          {...stringAvatar(`${findData?.approver_name}`, {
                            width: 30,
                            height: 30,
                            fontSize: "0.875rem",
                          })}
                        />
                        <Box className="min-w-0 flex-1">
                          <Typography variant="body2" className="font-semibold  wrap-break-word ">
                            {history}
                          </Typography>
                          {findData && (
                            <>
                              <Typography variant="subtitle2" className="font-semibold  truncate text-gray-600">
                                {findData?.email}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 block">
                                {dateFormatter(findData?.created_at.toString(), "MM/DD/YYYY hh:mm A")}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default History;
