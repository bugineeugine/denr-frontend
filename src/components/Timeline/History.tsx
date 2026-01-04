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
  const currentStep = data?.data.length ?? 0;

  return (
    <Box className="h-full ">
      <Timeline
        className="w-full max-w-[420px] px-2"
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {[...steps].reverse().map((label, index) => {
          const findData = data?.data[index];
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: isCompleted ? "success.main" : isCurrent ? "primary.main" : "grey.400",
                    boxShadow: isCurrent ? "0 0 0 4px rgba(25,118,210,0.15)" : "none",
                  }}
                >
                  {isCompleted ? <CheckCircle fontSize="small" /> : <CircleOutlinedIcon fontSize="small" />}
                </TimelineDot>

                {!isLast && (
                  <TimelineConnector
                    sx={{
                      bgcolor: isCompleted ? "success.main" : "grey.300",
                      width: "2px",
                      minHeight: 36,
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent className="pb-4">
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    borderLeft: `4px solid`,
                    borderLeftColor: isCompleted ? "success.main" : isCurrent ? "primary.main" : "grey.300",
                    backgroundColor: isCurrent ? "action.hover" : "background.paper",
                    transition: "all .2s ease",
                  }}
                >
                  <CardContent className="p-4 space-y-2">
                    {/* Step title */}
                    <Typography variant="body2" fontWeight={600}>
                      {label}
                    </Typography>

                    {findData ? (
                      <Box className="flex items-center gap-2">
                        <Avatar
                          {...stringAvatar(findData.approver_name, {
                            width: 28,
                            height: 28,
                            fontSize: "0.75rem",
                          })}
                        />
                        <Box className="min-w-0">
                          <Typography variant="subtitle2" className="truncate">
                            {findData.approver_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {findData.email}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Waiting for action
                      </Typography>
                    )}

                    {findData && (
                      <Typography variant="caption" color="text.secondary">
                        {dateFormatter(findData.created_at.toString(), "MMM DD, YYYY • hh:mm A")}
                      </Typography>
                    )}
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
