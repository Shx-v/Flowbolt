import { styled, useTheme } from "@mui/material/styles";
import Header from "@/Component/Header";

const HEADER_HEIGHT = 8;

const AuthLayoutRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f4f6f8",
});

const AuthLayoutContainer = styled("div")(({ theme }) => ({
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: theme.spacing(HEADER_HEIGHT),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

export const AuthLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <AuthLayoutRoot>
      {/* <Header /> */}

      <AuthLayoutContainer>{children}</AuthLayoutContainer>
    </AuthLayoutRoot>
  );
};
