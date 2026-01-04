import AnnualyPermit from "@/components/dashboard/AnnualyPermit";
import PermitMap from "@/components/dashboard/PermitMap";
import PermitStatus from "@/components/dashboard/PermitStatus";
import { DashboardDatatype } from "@/types/dashboard";
import axiosInstance from "@/utils/axiosInstance";
import { dateFormatter } from "@/utils/dateFormat";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { cookies } from "next/headers";

const DashboardPage = async () => {
  const cookieStore = await cookies();

  const response = await axiosInstance.get("/dashboard", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const permits = response.data.data as DashboardDatatype;
  console.dir(permits, { depth: null });
  return (
    <Box className="p-2 space-y-2">
      <Typography variant="h6">Dashboard & Analytics</Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, xl: 3 }}>
          <Card variant="outlined">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="font-bold">
                    {permits.totalPermits.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Total Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, xl: 3 }}>
          <Card variant="outlined">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="font-bold">
                    {permits.permitsToday.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Applications Submitted Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, xl: 3 }}>
          <Card variant="outlined">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="font-bold">
                    {permits.permitsThisWeek.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Applications This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, xl: 3 }}>
          <Card variant="outlined">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="font-bold">
                    {permits.permitsThisMonth.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Applications This Month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid size={12}>
          <AnnualyPermit permitByYear={permits.permitsByYear} />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" className="h-full">
            <CardHeader className="pb-0" title="Recent Applications" />
            <CardContent className="py-0">
              <List dense className="overflow-auto h-[350px]">
                {permits.latestPermits.map((permit) => {
                  return (
                    <ListItem
                      key={permit.id}
                      secondaryAction={
                        <Typography variant="body2">
                          {dateFormatter(permit.created_at, "MMMM D, YYYY h:mm A")}
                        </Typography>
                      }
                      className="border-b border-b-divider hover:bg-action-hover"
                    >
                      <ListItemText
                        primary={
                          <Typography>
                            {permit.permit_type} - {permit.permit_no}
                          </Typography>
                        }
                        secondary={permit.status}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <PermitStatus permitsByStatus={permits.permitsByStatus} />
        </Grid>
        <Grid size={12}>
          <PermitMap permits={permits.allPermit} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
