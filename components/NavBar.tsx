import {
  AppsOutlined,
  CalendarViewDayOutlined,
  ClassOutlined,
  ExpandLess,
  ExpandMore,
  InsertChartOutlined,
  Menu as MenuIcon,
  PeopleOutlined,
  PersonOutlineSharp,
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
  Collapse,
  ListItemSecondaryAction,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useState } from "react";

function ElevationScroll(props: any) {
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
  const [grades, setGrades] = useState(true);
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
              <NavLink to='/' icon={<AppsOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Home
              </NavLink>
              <NavLink
                to='/scheduleBuilder'
                icon={<CalendarViewDayOutlined sx={{ fontSize: "2em" }} />}
                setOpen={setOpen}>
                Schedule Builder
              </NavLink>

              {/* grades */}
              <ListItemButton
                divider
                onClick={() => {
                  setGrades(!grades);
                }}
                sx={{ px: 2 }}>
                <ListItemIcon>
                  <InsertChartOutlined sx={{ fontSize: "2em" }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant='h5'>Data</Typography>}></ListItemText>
                <ListItemSecondaryAction>{grades ? <ExpandLess /> : <ExpandMore />}</ListItemSecondaryAction>
              </ListItemButton>
              <Collapse in={grades} unmountOnExit>
                <GradesNavLink
                  to='/instructors'
                  icon={<PersonOutlineSharp sx={{ fontSize: "2em" }} />}
                  setOpen={setOpen}>
                  Instructors
                </GradesNavLink>
                <GradesNavLink to='/courses' icon={<ClassOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                  Courses
                </GradesNavLink>
                {/* <GradesNavLink
                  to='/data/departments'
                  icon={<HouseOutlined sx={{ fontSize: "2em" }} />}
                  setOpen={setOpen}>
                  Departments
                </GradesNavLink> */}
              </Collapse>

              <NavLink to='/help' icon={<QuestionMarkOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Help & Info
              </NavLink>
              <NavLink to='/credits' icon={<PeopleOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Credits
              </NavLink>
            </List>
          </Drawer>
          <Typography sx={{ fontSize: { xs: 20, md: 24 } }}>
            <Link href='/'>
              <a style={linkStyles}>CPP Scheduler</a>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

let linkStyles: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
};

function NavLink(props: {
  to: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  icon: JSX.Element;
  children: JSX.Element | string;
}) {
  return (
    <Link href={props.to}>
      <a style={linkStyles}>
        <ListItemButton
          divider
          onClick={() => {
            props.setOpen(false);
          }}
          sx={{ px: 2 }}>
          <ListItemIcon> {props.icon}</ListItemIcon>
          <ListItemText primary={<Typography variant='h5'>{props.children}</Typography>}></ListItemText>
        </ListItemButton>
      </a>
    </Link>
  );
}

function GradesNavLink(props: {
  to: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  icon: JSX.Element;
  children: JSX.Element | string;
}) {
  return (
    <Link href={props.to}>
      <a style={linkStyles}>
        <ListItemButton
          divider
          onClick={() => {
            props.setOpen(false);
          }}
          sx={{ pr: 2, pl: 4 }}>
          <ListItemIcon> {props.icon}</ListItemIcon>
          <ListItemText primary={<Typography variant='h5'>{props.children}</Typography>}></ListItemText>
        </ListItemButton>
      </a>
    </Link>
  );
}
