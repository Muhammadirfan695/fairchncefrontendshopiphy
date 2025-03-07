import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import useSWR from 'swr';
import { fetchMerchantsList } from 'src/api/merchants';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'storeName', label: 'Store Name', width: 220 },
  // { id: 'city', label: 'city', width: 180 },
  // { id: 'address', label: 'address', width: 250 },
  { id: 'StoreCode', label: 'Store Code ', width: 120 },
  { id: 'StoreUrl', label: 'Store URL', width: 120 },
  { id: 'primaryPhone', label: 'Primary Phone', width: 120 },
  { id: 'primaryEmail', label: 'Primary Email', width: 120 },
  // { id: 'secondaryPhone', label: 'Secondary Phone', width: 120 },
  // { id: 'secondaryEmail', label: 'Secondary Email', width: 120 },
  { id: 'status', label: 'Status', width: 120 },
  { id: '', label: '', width: 120 },
];

// Default filters for the table
const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function MerchantListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  // console.log('mer data ===========>', tableData);

  const [filters, setFilters] = useState(defaultFilters);

  const { data, error } = useSWR('shopifyProducts', fetchMerchantsList);
  // console.log('data fetched from SWR:', data);

  const isLoading = !data && !error;

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.dist)) {
      setTableData(data.data.dist); // Ensure you're setting the correct array from the API response
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData, // Use tableData for filtering
    comparator: getComparator('asc', 'name'), // You can adjust the order logic as needed
    filters,
  });

  // console.log("Filtered Data:", dataFiltered); // Debug the filtered data

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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
      const deleteRow = tableData.filter((row) => row.merchantStoreId !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.merchantStoreId));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData?.length,
      totalRowsInPage: dataInPage?.length,
      totalRowsFiltered: dataFiltered?.length,
    });
  }, [dataFiltered?.length, dataInPage?.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const role = localStorage.getItem('role'); 
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Merchants"
          links={[{ name: 'Merchants', href: paths.dashboard.merchantStore.new }, { name: 'List' }]}
          action={
            role !== 'merchant' ? ( // Check if the role is not merchant
              <Button
                onClick={handleOpenModal} // Open the modal on click
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Merchant
              </Button>
            ) : null // If role is merchant, don't render the button
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS?.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters?.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      // (tab.value === 'pending' && 'warning') ||
                      // (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData?.length}
                    {/* {tab.value === 'active' &&
                      tableData?.filter((user) => user.status === 'active')?.length}
                    {tab.value === 'pending' &&
                      tableData?.filter((user) => user.status === 'pending')?.length}
                    {tab.value === 'banned' &&
                      tableData?.filter((user) => user.status === 'banned')?.length} */}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected?.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData?.map((row) => row.merchantStoreId)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected?.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData?.map((row) => row.merchantStoreId)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row) => (
                      <UserTableRow
                        key={row.merchantStoreId}
                        row={row}
                        selected={table.selected.includes(row.merchantStoreId)}
                        onSelectRow={() => table.onSelectRow(row.merchantStoreId)}
                        onDeleteRow={() => handleDeleteRow(row.merchantStoreId)}
                        onEditRow={() => handleEditRow(row.merchantStoreId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
                  />
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
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Rows per page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Card>
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
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
          }}
        >
          <UserNewEditForm onClose={handleCloseModal} />
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        onConfirm={handleDeleteRows}
        title="Delete row?"
        content="Are you sure you want to delete selected rows?"
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name?.toLowerCase().indexOf(name?.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role?.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
