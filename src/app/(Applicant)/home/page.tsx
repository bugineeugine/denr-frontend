import PermitStatus from "@/components/dashboard/PermitStatus";
import PermitDrawer from "@/components/permit/PermitDrawer";
import PermitMapByUser from "@/components/permit/PermitMapByUser";
import { DashboardDatatype } from "@/types/dashboard";
import axiosInstance from "@/utils/axiosInstance";
import { dateFormatter } from "@/utils/dateFormat";
import decodedToken from "@/utils/decodedToken";
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

const HomPage = async () => {
  const cookieStore = await cookies();
  const decoded = decodedToken(cookieStore.get("accessToken")?.value || "");
  const userType = decoded.id;
  const response = await axiosInstance.get(`/dashboard/${userType}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const permits = response.data.data as DashboardDatatype;

  return (
    <Box className="p-2 space-y-2">
      <Typography variant="h6">Dashboard</Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 3 }}>
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
        <Grid size={{ xs: 12, sm: 3 }}>
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
        <Grid size={{ xs: 12, sm: 3 }}>
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
        <Grid size={{ xs: 12, sm: 3 }}>
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
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" className="h-full">
            <CardHeader className="pb-0" title="My Recent Applications" />
            <CardContent className="py-0">
              <List dense className="overflow-auto h-[350px]">
                {permits.latestPermits.length === 0 ? (
                  <ListItem className="h-full flex justify-center items-center">
                    <Typography variant="body1" color="text.secondary" className="text-center py-6">
                      You have not submitted any application yet.
                    </Typography>
                  </ListItem>
                ) : (
                  permits.latestPermits.map((permit) => (
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
                          <Box className="flex items-center space-x-2">
                            <PermitDrawer permit={permit} />
                            <Typography>
                              {permit.permit_type} - {permit.permit_no}
                            </Typography>
                          </Box>
                        }
                        secondary={permit.status}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <PermitStatus permitsByStatus={permits.permitsByStatus} />
        </Grid>
        <Grid size={12}>
          <Card>
            <CardContent>
              <PermitMapByUser permits={permits.permitByUserId} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomPage;
