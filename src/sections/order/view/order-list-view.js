import useSWR from 'swr'; // Correct import order
import { useRouter } from 'src/routes/hooks';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { Modal } from '@mui/base';
import { Box } from '@mui/system';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api

// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useAuthContext } from 'src/auth/hooks';
import { fetchShopifyOrders } from 'src/api/orders';
// import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableRow from '../order-table-row';

import UserNewEditForm from '../order-new-edit-form';

// import ProductTableRow from '../product-table-row';
// import ProductTableToolbar from '../product-table-toolbar';
// import ProductTableFiltersResult from '../product-table-filters-result';
const TABLE_HEAD = [
  { id: 'name', label: 'Product Name', width: 200 },
  { id: 'price', label: 'Price', width: 120 },
  { id: 'quantity', label: 'Quantity', width: 100 },
  { id: 'total', label: 'Total Price (PKR)', width: 150 },
  // { id: 'tax', label: 'Tax (PKR)', width: 120 },
  { id: 'variant', label: 'Variant Title', width: 150 },
  { id: 'vendor', label: 'Vendor', width: 150 },
  { id: 'action', label: 'Action', width: 100 },
  { id: '', label: '', width: 100 },
];

const defaultFilters = {
  name: '',
  publish: [],
  stock: [],
};

export default function OrderListView() {
  const router = useRouter();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { authData } = useAuthContext(); // Accessing the current user's role

  const { data, error } = useSWR('shopifyOrders', fetchShopifyOrders);

  const isLoading = !data && !error;

  useEffect(() => {
    if (data) {
      setTableData(data.orders);
    }
  }, [data]);

  // Handle data filtering
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const notFound = !dataFiltered?.length && isLoading;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage?.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage?.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(`/order/edit/${id}`);
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(`/order/details/${id}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const notFound = !dataFiltered.length && (error || isLoading);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const role = localStorage.getItem('role'); 


  return (
    <><Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Orders"
        links={[{ name: 'Orders', href: paths.dashboard.order.new }, { name: 'List' }]}
        action={role === 'admin' && ( // Check if the user's role is admin
          <Button
            onClick={handleOpenModal}
            // component={RouterLink}
            // href={paths.dashboard.order.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Order
          </Button>
        )}
        sx={{
          mb: { xs: 3, md: 5 },
        }} />

      <Card>
        <OrderTableToolbar filters={filters} onFilters={handleFilters} />
        {filters.name && (
          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={() => setFilters(defaultFilters)}
            results={dataFiltered?.length} />
        )}
        <TableContainer>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData?.length}
                numSelected={table.selected?.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => table.onSelectAllRows(
                  checked,
                  tableData?.map((row) => row.id)
                )} />
              <TableBody>
                {isLoading
                  ? [...Array(table.rowsPerPage)]?.map((_, index) => (
                    <TableSkeleton key={index} sx={{ height: 60 }} />
                  ))
                  : dataInPage?.map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => router.push(`/order/edit/${row.id}`)}
                      onViewRow={() => router.push(`/order/details/${row.id}`)} />
                  ))}
                <TableEmptyRows
                  height={60}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)} />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered?.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense} />
      </Card>
    </Container>
    
    <Modal open={openModal} onClose={handleCloseModal} sm>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '50%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh', // Limit height to 80% of viewport height
            overflowY: 'auto', // Enable vertical scroll
            backgroundColor: 'white',
            padding: 2,
          }}
        >
          <UserNewEditForm onClose={handleCloseModal} />
        </Box>
      </Modal></>
  );
}

// Apply filters (unchanged from your code)
function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  return name
    ? inputData.filter((orders) => orders?.title?.toLowerCase().includes(name?.toLowerCase()))
    : inputData;
}
