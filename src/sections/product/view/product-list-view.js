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
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api

import { fetchShopifyProducts } from 'src/api/product';
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
// import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';

const TABLE_HEAD = [
  { id: 'sku', label: 'SKU-Code', width: 30 },
  { id: 'image', label: 'Product Image', width: 150 },
  // { id: 'sku', label: 'SKU', width: 200 },
  // { id: 'price', label: 'Price', width: 150 },
  // { id: 'Committed', label: 'Committed', width: 160 },
  // { id: 'Available', label: 'Available', width: 160 },
  { id: 'title', label: 'Product Title', width: 150,  },
  { id: 'status', label: 'Status', width: 160, align:'center' },
  { id: 'action', label: 'Action', width: 100 },
];

const defaultFilters = {
  name: '',
  publish: [],
  stock: [],
};

export default function ProductListView() {
  const router = useRouter();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const { data, error } = useSWR('shopifyProducts', fetchShopifyProducts);
  console.log(data);
  
  const isLoading = !data && !error;

  useEffect(() => {
    if (data) {
      setTableData(data.products); // Always set data unconditionally
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
      router.push(`/product/edit/${id}`);
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(`/product/details/${id}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const notFound = !dataFiltered?.length && (error || isLoading);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Inventory"
        links={[{ name: 'Inventory', href: '/product' }, { name: 'List' }]}
      />
      <Card>
        <ProductTableToolbar filters={filters} onFilters={handleFilters} />
        {filters.name && (
          <ProductTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={() => setFilters(defaultFilters)}
            results={dataFiltered?.length}
          />
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
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData?.map((row) => row.id)
                  )
                }
              />
              <TableBody>
                {isLoading
                  ? [...Array(table.rowsPerPage)]?.map((_, index) => (
                      <TableSkeleton key={index} sx={{ height: 60 }} />
                    ))
                  : dataInPage?.map((row) => (
                      <ProductTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => router.push(`/product/edit/${row.id}`)}
                        onViewRow={() => router.push(`/product/details/${row.id}`)}
                      />
                    ))}
                <TableEmptyRows
                  height={60}
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

// Apply filters (unchanged from your code)
function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  return name
    ? inputData.filter((product) => product.title.toLowerCase().includes(name.toLowerCase()))
    : inputData;
}
