import Account from "./Account";
import Hamburger from "./Hamburger";
import Image from "next/image";
import SystemName from "./SystemName";
import LiveDateTime from "./LiveDateTime";
import { Box } from "@mui/material";

const AppBarContent = ({ showBurger = false }: { showBurger?: boolean }) => {
  return (
    <>
      {!showBurger && <Hamburger />}

      <Box className="flex items-center gap-2">
        <div className="w-12 h-12 bg-denr-green rounded-full flex items-center justify-center">
          <Image src="/denr.png" alt="Logo" width={45} height={45} className="mx-auto mb-1 rounded-full bg-white p-2" />
        </div>
        <SystemName />
      </Box>
      <div className="grow" />
      <LiveDateTime />

      <Account />
    </>
  );
};

export default AppBarContent;
