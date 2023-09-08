import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AddPost from "../Posts/AddPost";
import GetPost from "../Posts/GetPost";
import GetAllPosts from "../Posts/GetAllPosts";
import LoggedUser from "../Users/LoggedUser";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function GridHomePage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item><AddPost/></Item>
          <Item><GetAllPosts/></Item>
        </Grid>
        <Grid item xs={4}>
          <Item><LoggedUser/></Item>
        </Grid>
      </Grid>
    </Box>
  );
}
