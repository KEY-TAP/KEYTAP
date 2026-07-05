import { getUsers } from "@/lib/api/users";
import UserTable from "./_components/userTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        유저 관리
      </Typography>
      <UserTable users={users} />
    </Box>
  );
}
