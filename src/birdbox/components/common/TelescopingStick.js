import { Button, IconButton, Slider } from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import { ControlTelescope } from "src/networks/Telescope";

export default function TelescopingStick({
  alertMetas,
  setAlertMetas,
  deviceId,
}) {
  const [value, setValue] = useState(0);
  const [disabledButton, setDisabledButton] = useState(null);
  const [telescopicCommand, setTelescopicCommand] = useState(null);

  const handleTelescopicCommand = async (command) => {
    try {
      if (command === "stop") {
        setTelescopicCommand(command);
        const res = await ControlTelescope(deviceId, command);

        if (res?.status === "success") {
          setAlertMetas({
            ...alertMetas,
            severity: "success",
            snackBarOpened: true,
            msg: "Telescope stopped successfully",
          });
          setTimeout(
            () =>
              setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
            4000
          );
          setDisabledButton(null);
        } else {
          throw new Error("Failed to stop the telescope");
        }
        return;
      }

      if (
        (command === "up" && value < 10) ||
        (command === "down" && value > 0)
      ) {
        setTelescopicCommand(command);
        const res = await ControlTelescope(deviceId, command);

        if (res?.status === "success") {
          setAlertMetas({
            ...alertMetas,
            severity: "success",
            snackBarOpened: true,
            msg: `${command.toUpperCase()} command sent successfully`,
          });
          setTimeout(
            () =>
              setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
            4000
          );
          setValue((prev) => (command === "up" ? prev + 1 : prev - 1));

          setDisabledButton(command);
          setTimeout(() => setDisabledButton(null), 30000);
        } else {
          setAlertMetas({
            ...alertMetas,
            severity: "error",
            snackBarOpened: true,
            msg: `Failed to execute command: ${command}`,
          });
          setTimeout(
            () =>
              setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
            4000
          );
        }
      }
    } catch (error) {
      setAlertMetas({
        ...alertMetas,
        severity: "error",
        snackBarOpened: true,
        msg: "Failed to execute command. Please try again.",
      });
      setTimeout(
        () => setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
        4000
      );
    }
  };

  return (
    <>
      <IconButton
        aria-label="up"
        variant="outlined"
        sx={{
          border: "none",
          borderRadius: "8px !important",
          padding: 0,
          backgroundColor: "#ffffff",
        }}
        onClick={() => handleTelescopicCommand("up")}
        disabled={disabledButton === "up"}
      >
        <ExpandLessIcon />
      </IconButton>

      <Slider
        value={value}
        min={0}
        max={10}
        step={1}
        orientation="vertical"
        sx={{
          color: "#ffffff",
          "& .MuiSlider-thumb": {
            backgroundColor: "#ffffff",
            pointerEvents: "none",
          },
          "& .MuiSlider-track": {
            backgroundColor: "#ffffff",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#171D40",
          },
        }}
      />
      <IconButton
        aria-label="down"
        sx={{
          border: "none",
          borderRadius: "8px !important",
          padding: 0,
          backgroundColor: "#ffffff",
        }}
        onClick={() => handleTelescopicCommand("down")}
        disabled={disabledButton === "down"}
      >
        <ExpandMoreIcon />
      </IconButton>
      <Button
        variant="outlined"
        color="primary"
        sx={{ backgroundColor: "#ffffff" }}
        startIcon={<DoNotDisturbAltOutlinedIcon />}
        onClick={() => handleTelescopicCommand("stop")}
      >
        Stop
      </Button>
    </>
  );
}
