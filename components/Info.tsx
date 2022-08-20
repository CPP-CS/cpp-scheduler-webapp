import { InfoOutlined } from "@mui/icons-material";
import { IconButton, SxProps, Tooltip } from "@mui/material";

export function Info(props: {
  text: string;
  sx?: SxProps;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
}) {
  return (
    <Tooltip
      enterTouchDelay={0}
      leaveTouchDelay={999999}
      title={props.text}
      arrow
      sx={props.sx}
      placement={props.placement}>
      <IconButton size='small' sx={{ p: 0 }}>
        <InfoOutlined color='info' sx={{ fontSize: 20 }} />
      </IconButton>
    </Tooltip>
  );
}
