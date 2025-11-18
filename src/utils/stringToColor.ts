import { SxProps } from '@mui/material';
function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  // generate hue from hash (0 - 360)
  const hue = Math.abs(hash) % 360;
  const saturation = 65; // mas punchy, hindi sobrang pale
  const lightness = 55; // balanced brightness (50–60 usually maganda)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function stringAvatar(name: string, sx?: SxProps) {
  const parts = name.trim().split(' ');
  let initials = parts[0][0]; // first letter ng first word

  if (parts.length > 1) {
    initials += parts[1][0]; // dagdag first letter ng second word
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
      ...sx,
    },
    children: initials?.toUpperCase(),
  };
}
