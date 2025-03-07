import PropTypes from 'prop-types'; // Import PropTypes

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

// AppWidgetSummary Component with Prop Validation
export default function AppWidgetSummary({ title, total, iconPath }) {
// console.log("title============>", total)
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Title and Icon */}
          <Typography variant="subtitle1">{title}</Typography>
          <img alt={title} src={iconPath} width={50} height={50} />
        </Stack>
        <Typography variant="h3">{total}</Typography> {/* Display total number */}
      </Box>
    </Card>
  );
}

// Prop Types Validation
AppWidgetSummary.propTypes = {
  title: PropTypes.string.isRequired,   // title should be a string and required
  total: PropTypes.number.isRequired,   // total should be a number and required
  iconPath: PropTypes.string.isRequired, // iconPath should be a string and required
};
