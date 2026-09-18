import { getUsers } from "@/lib/api/users";
import UserTable from "./_components/userTable";
import Box from "@mui/material/Box";
import Header from "../_components/Header";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <Box>
      {/* 헤더 */}
      <Header title="유저 관리" />

      <UserTable users={users} />
    </Box>
  );
}
