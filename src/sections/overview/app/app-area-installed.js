import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
// components
import Iconify from 'src/components/iconify';
import Chart from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AppAreaInstalled({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('2019');
  const [chartOptions, setChartOptions] = useState(null);

  // Properly initialize chart options
  useEffect(() => {
    const updatedOptions = {
      colors: colors.map((colr) => colr[1]),
      fill: {
        type: 'gradient',
        gradient: {
          colorStops: colors.map((colr) => [
            { offset: 0, color: colr[0] },
            { offset: 100, color: colr[1] },
          ]),
        },
      },
      xaxis: {
        categories,
      },
      ...options,
    };

    setChartOptions(updatedOptions);

    if (series && series.length > 0) {
      setSeriesData(series[0].year);
    }
  }, [colors, categories, options, series]);

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    
      <><Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<ButtonBase
          onClick={popover.onOpen}
          sx={{
            pl: 1,
            py: 0.5,
            pr: 0.5,
            borderRadius: 1,
            typography: 'subtitle2',
            bgcolor: 'background.neutral',
          }}
        >
          {seriesData}
          <Iconify
            width={16}
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: 0.5 }} />
        </ButtonBase>} />

      {series.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
          {item.year === seriesData && chartOptions && (
            <Chart dir="ltr" type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card><CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover></>
    
  );
}

AppAreaInstalled.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
