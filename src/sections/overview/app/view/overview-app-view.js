import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings';
import AppWidgetSummary from '../app-widget-summary';
import AppNewInvoice from '../app-new-invoice';
import AppAreaInstalled from '../app-area-installed';

export default function OverviewAppView() {
  const settings = useSettingsContext();
  const { authData } = useAuthContext(); // Accessing the current user's role
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    orderedItemsOverTime: 0,
    returns: 0,
    fulfilledOrdersOverTime: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Placeholder categories
    series: [
      {
        name: 'Orders',
        data: [0, 0, 0, 0, 0, 0, 0], // Placeholder data
      },
    ],
  });
  const role = localStorage.getItem('role');
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get(
          `${process.env.REACT_APP_HOST_API}/api/shopify/orders`
        );
        const { orders } = ordersResponse.data;

        const totalOrders = orders.length;
        const orderedItemsOverTime = orders.reduce(
          (total, order) => total + order.line_items.length,
          0
        );
        const returns = orders.filter((order) => order.financial_status === 'refunded').length;
        const fulfilledOrdersOverTime = orders.filter(
          (order) => order.fulfillment_status === 'fulfilled'
        ).length;

        const ordersByDay = Array(7).fill(0);
        orders.forEach((order) => {
          const dayIndex = new Date(order.created_at).getDay();
          ordersByDay[dayIndex] += 1;
        });

        setOrderStats({
          totalOrders,
          orderedItemsOverTime,
          returns,
          fulfilledOrdersOverTime,
        });

        setChartData({
          categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          series: [
            {
              name: 'Orders',
              data: ordersByDay,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching Shopify orders:', error.message);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const productsResponse = await axios.get(
          `${process.env.REACT_APP_HOST_API}/api/shopify/products`
        );
        const top5Products = productsResponse.data.products.slice(0, 5);
        setTopProducts(top5Products);
      } catch (error) {
        console.error('Error fetching top products:', error.message);
      }
    };

    fetchOrders();
    fetchTopProducts();
  }, []);

  const renderCards = () => {
    const cardData = [
      {
        title: 'Total Orders',
        total: orderStats.totalOrders,
        iconPath: '/assets/icons/glass/ic_glass_buy.png',
      },
      {
        title: 'Ordered Items Over Time',
        total: orderStats.orderedItemsOverTime,
        iconPath: '/assets/icons/glass/ic_glass_bag.png',
      },
      {
        title: 'Returns',
        total: orderStats.returns,
        iconPath: '/assets/icons/glass/ic_glass_users.png',
      },
      {
        title: 'Fulfilled Orders Over Time',
        total: orderStats.fulfilledOrdersOverTime,
        iconPath: '/assets/icons/glass/ic_glass_message.png',
      },
    ];

    const visibleCards = authData?.role === 'merchant' ? cardData.slice(0, 2) : cardData;

    return visibleCards.map((card, index) => (
      <Grid item xs={12} md={3} key={index}>
        <AppWidgetSummary title={card.title} total={card.total} iconPath={card.iconPath} />
      </Grid>
    ));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* Conditional Heading Based on Role */}
      <Grid container item xs={12} sx={{ mb: 3 }}>
        <Typography variant="h4">
          {role === 'merchant' ? 'Merchant Dashboard' : 'Admin Dashboard'}
        </Typography>
      </Grid>

      <Grid container spacing={3}>
        {/* Cards Row */}
        <Grid container item spacing={3}>
          {renderCards()}
        </Grid>

        {/* Charts and Table Row */}
        <Grid container item spacing={3}>
          <Grid item xs={12} md={6}>
            <AppAreaInstalled title="Orders This Week" chart={chartData} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AppNewInvoice
              title="Inventory Summary"
              tableData={topProducts}
              tableLabels={[
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Item Name' },
                { id: 'quantity', label: 'Quantity Sold' },
                { id: 'price', label: 'Selling Price' },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
