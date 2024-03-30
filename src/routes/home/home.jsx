import * as React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import Tooltip from "@mui/material/Tooltip";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RouterIcon from "@mui/icons-material/Router";
import ApartmentIcon from "@mui/icons-material/Apartment";
import "./home.css";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CytoscapeComponent from './cytoscape';
import {
  mainListItems,
  secondaryListItems,
} from "../../components/listItems/listItems";
// import GraphComponent from "../../components/graphComponent/graphComponent";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Home() {
  const [open, setOpen] = React.useState(true);
  const [routerData, setRouterData] = React.useState(null);
  const [buildingData, setBuildingData] = React.useState(null);
  const [hoveredBuilding, setHoveredBuilding] = React.useState(null);
  const [selectedBuilding, setSelectedBuilding] = React.useState(null);
  const [selectedRouter, setSelectedRouter] = React.useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const routerArray = [
    {
      id: 1,
      deviceType: "Router",
      deviceSeries: "Series 1000",
      label: "Router 1",
      ip: "192.168.1.1",
      softwareVersion: "v1.0",
      nodeType: "Router",
      family: "Cisco",
      platformId: "1000",
      mac: "00:11:22:33:44:55",
    },
    {
      id: 2,
      deviceType: "Router",
      deviceSeries: "Series 2000",
      label: "Router 2",
      ip: "192.168.1.2",
      softwareVersion: "v2.0",
      nodeType: "Router",
      family: "Cisco",
      platformId: "2000",
      mac: "00:22:33:44:55:66",
    },
  ];

  const floorsArray = [
    {
      floorName: "Floor 1",
      color: "#ebcbb7",
      number: 1,
      buildings: [
        {
          number: 1,
          color: "#51e879",
          label: "Building 1",
          ip: "10.20.20.0/18",
        },
        {
          number: 2,
          color: "#63d4e0",
          label: "Building 2",
          ip: "10.20.20.0/19",
        },
        {
          number: 3,
          color: "#a6c6ed",
          label: "Building 3",
          ip: "10.20.20.0/20",
        },
        {
          number: 4,
          color: "#cb9bde",
          label: "Building 4",
          ip: "10.20.20.0/21",
        },
        {
          number: 5,
          color: "#e39ae2",
          label: "Building 5",
          ip: "10.20.20.0/22",
        },
      ],
    }
  ];
  const [buildings, setBuildings] = React.useState(floorsArray[0]?.buildings);
  const [selectedFloor, setSelectedFloor] = React.useState(floorsArray[0]);

  const handleFloorClick = (floor) => {
    setSelectedFloor(floor);
    setBuildings(floor.buildings);
    setBuildingData(null);
    setSelectedBuilding(null);
  };

  const handleRouterClick = (router) => {
    const selected = routerArray.find((r) => r.label === router);
    if (selected) {
      setSelectedRouter(router);
      console.log(router);

      setRouterData(selected);
      setBuildingData(null);
      setSelectedBuilding(null);
    }
  };

  const handleBuildingClick = (building) => {
    // Dummy data for building info
    setSelectedBuilding(building);
    setSelectedRouter(null);
    setBuildingData(building);
    setRouterData(null);
  };

  const [isHovered, setIsHovered] = React.useState(false);

  // Function to handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Function to handle mouse leave events
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoordinates(0, 0);
  };

  // Define the style object for the component
  const mapStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    // color: isHovered ? "white" : "black",
    backgroundImage: isHovered
      ? 'url("https://www.advancedcustomfields.com/wp-content/uploads/2013/11/acf-google-map-field-interface.png")'
      : "none",
  };

  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  // Function to handle mouse move events
  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.target.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    setCoordinates({ x, y });
  };

  // console.log(coordinates);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {/* <GraphComponent /> */}
          <Container maxWidth="100%" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={3} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 340,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Ip Schema
                  </Typography>
                  {buildings.length !== 0 &&
                    buildings.map((building) => (
                      <div key={building.number}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight:
                              hoveredBuilding?.ip === building.ip
                                ? "bold"
                                : "normal", // Bold styling if the building is hovered
                          }}
                        >
                          Subnet {building.number}: {building.ip}
                        </Typography>
                      </div>
                    ))}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 340,
                  }}
                >
                  {" "}
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Campus Core{" "}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      mb: 4,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRouterClick("Router 1")}
                      sx={{
                        mr: 2,
                        backgroundColor:
                          selectedRouter === "Router 1"
                            ? "green"
                            : defaultTheme.palette.primary.main,
                      }}
                    >
                      Router 1
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRouterClick("Router 2")}
                      sx={{
                        backgroundColor:
                          selectedRouter === "Router 2"
                            ? "green"
                            : defaultTheme.palette.primary.main,
                      }}
                    >
                      Router 2
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,

                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {buildings.length !== 0 &&
                      buildings.map((building) => {
                        let backgroundColor;
                        if (!hoveredBuilding) backgroundColor = building.color;
                        else if (
                          hoveredBuilding &&
                          hoveredBuilding === building
                        ) {
                          backgroundColor = building.color; // Set the background color to the original color if the building is hovered
                        } else {
                          backgroundColor = "grey"; // Set the background color to grey if no building is hovered or the building is not hovered
                          console.log("not hovered");
                        }
                        return (
                          <Box
                            key={building.number}
                            sx={{
                              width: 130, // Increased box size
                              height: 60, // Increased box size
                              backgroundColor,
                              color: "black",
                              fontFamily: "sans-serif",
                              fontWeight: "bold",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              margin: "5px",
                              cursor: "pointer",
                              border:
                                selectedBuilding?.number === building.number
                                  ? "3px solid black"
                                  : "none",
                              borderRadius: "5px",
                            }}
                            onClick={() => handleBuildingClick(building)}
                            onMouseEnter={() => setHoveredBuilding(building)}
                            onMouseLeave={() => setHoveredBuilding(null)}
                          >
                            Building {building.number}
                          </Box>
                        );
                      })}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 340,
                  }}
                >
                  {routerData && (
                    <div>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Router Information:
                      </Typography>
                      <Typography variant="body1">
                        Device Type: {routerData.deviceType}
                      </Typography>
                      <Typography variant="body1">
                        Device Series: {routerData.deviceSeries}
                      </Typography>
                      <Typography variant="body1">
                        Label: {routerData.label}
                      </Typography>
                      <Typography variant="body1">
                        IP: {routerData.ip}
                      </Typography>
                      <Typography variant="body1">
                        Software Version: {routerData.softwareVersion}
                      </Typography>
                      <Typography variant="body1">
                        Node Type: {routerData.nodeType}
                      </Typography>
                      <Typography variant="body1">
                        Family: {routerData.family}
                      </Typography>
                      <Typography variant="body1">
                        Platform ID: {routerData.platformId}
                      </Typography>
                      <Typography variant="body1">
                        MAC: {routerData.mac}
                      </Typography>
                    </div>
                  )}
                  {buildingData && (
                    <div>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Building Information:
                      </Typography>
                      <Typography variant="body1">
                        Building Name: Building {buildingData?.number}
                      </Typography>
                    </div>
                  )}
                </Paper>
              </Grid>




              <Grid item xs={12}>
                <Tooltip
                  title={
                    <div
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                      }}
                    >
                      <div>
                        The x and y coordinates of the image are {coordinates.x}{" "}
                        and {coordinates.y}{" "}
                      </div>
                      {/* Add more lines as needed */}
                    </div>
                  }
                  arrow
                  placement="top"
                >
                  <Paper
                    sx={{
                      p: 2,
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="campus-map"
                    style={mapStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={() => console.log("image click", coordinates)}
                  >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Campus Map{" "}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,

                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {buildings.length !== 0 &&
                        buildings.map((building) => {
                          let backgroundColor;
                          if (!hoveredBuilding)
                            backgroundColor = building.color;
                          else if (
                            hoveredBuilding &&
                            hoveredBuilding === building
                          ) {
                            backgroundColor = building.color; // Set the background color to the original color if the building is hovered
                          } else {
                            backgroundColor = "grey"; // Set the background color to grey if no building is hovered or the building is not hovered
                          }
                          return (
                            <Tooltip
                              key={building?.number}
                              title={
                                <div
                                  style={{ fontSize: "18px", padding: "10px" }}
                                >
                                  <div>Building Number: {building?.number}</div>
                                  <div>
                                    Subnet {building?.number}:{" "}
                                    {hoveredBuilding?.ip}
                                  </div>
                                  {/* Add more lines as needed */}
                                </div>
                              }
                              arrow
                              placement="top"
                            >
                              <Box
                                sx={{
                                  width: 150,
                                  height: 70,
                                  backgroundColor,
                                  color: "black",
                                  fontFamily: "sans-serif",
                                  fontWeight: "bold",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "5px",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() =>
                                  setHoveredBuilding(building)
                                }
                                onMouseLeave={() => setHoveredBuilding(null)}
                              >
                                Building {building?.number}
                              </Box>
                            </Tooltip>
                          );
                        })}
                    </Box>
                  </Paper>
                </Tooltip>
              </Grid>










              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    height: 'calc(65vh - 64px)',
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Building connections
                  </Typography>
                  {/* Here is the Cytoscape graph */}
                  <CytoscapeComponent />
                </Paper>
              </Grid>
            </Grid>

          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}