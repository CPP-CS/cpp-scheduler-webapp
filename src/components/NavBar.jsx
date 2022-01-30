import {
  CalendarViewDayOutlined,
  GradeOutlined,
  HomeMaxOutlined,
  Menu as MenuIcon,
  QuestionMarkOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0,
    color: trigger ? "primary" : "transparent",
  });
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <ElevationScroll>
      <AppBar>
        <Toolbar>
          <IconButton size='large' color='inherit' sx={{ mr: 2 }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <List>
              <ListSubheader>
                <Typography variant='h2'>Navigation</Typography>
              </ListSubheader>
              <Divider sx={{ mt: 2 }}></Divider>
              <NavLink to='/home' key='home' icon={<HomeMaxOutlined sx={{ fontSize: "2em" }} />}>
                Home
              </NavLink>
              <NavLink
                to='/scheduleBuilder'
                key='scheduleBuilder'
                icon={<CalendarViewDayOutlined sx={{ fontSize: "2em" }} />}>
                Schedule Builder
              </NavLink>
              <NavLink to='/grades' key='grades' icon={<GradeOutlined sx={{ fontSize: "2em" }} />}>
                Grades
              </NavLink>
              <NavLink to='/help' key='help' icon={<QuestionMarkOutlined sx={{ fontSize: "2em" }} />}>
                Help & Info
              </NavLink>
            </List>
          </Drawer>
          <Typography variant='h5'>CPP Scheduler</Typography>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

function NavLink(props) {
  const navigate = useNavigate();
  return (
    <ListItemButton divider button key={props.key} onClick={() => navigate(props.to)} sx={{ px: 4 }}>
      <ListItemIcon> {props.icon}</ListItemIcon>
      <ListItemText primary={<Typography variant='h5'>{props.children}</Typography>}></ListItemText>
    </ListItemButton>
  );
}
