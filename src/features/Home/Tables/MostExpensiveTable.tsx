import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { Table } from 'components';
import { useItems } from 'hooks/useItems';
import { IsMembersItemRenderer, ItemRenderer } from './cellRenderers';
import {
  addCommasFormatter,
  addUnknown,
  getBuyLimitCellClass,
  getChainedValueFormatter,
  getMarginCellClass,
} from './TableUtilFunctions';
import styles from './HomeTables.mod.scss';

const columnDefs: ColDef[] = [
  {
    field: 'item',
    cellRenderer: ItemRenderer,
  },
  {
    field: 'members',
    cellRenderer: IsMembersItemRenderer,
  },
  {
    field: 'buyLimit',
    valueFormatter: getChainedValueFormatter([addCommasFormatter, addUnknown]),
    cellClass: getBuyLimitCellClass,
  },
  {
    field: 'buyPrice',
    valueFormatter: addCommasFormatter,
  },
  {
    field: 'sellPrice',
    valueFormatter: addCommasFormatter,
  },
  {
    field: 'margin',
    valueGetter: (params) => {
      return params.data.buyPrice - params.data.sellPrice;
    },
    cellClass: getMarginCellClass,
    valueFormatter: addCommasFormatter,
  },
  {
    field: 'dailyVolume',
  },
];

export const MostExpensiveTable = () => {
  const { items } = useItems();

  const mostExpensiveRowData = useMemo(() => {
    return [...items]
      .sort((a, b) => {
        if (a.high === b.high) {
          return 0;
        } else if (a.high === undefined) {
          return 1;
        } else if (b.high === undefined) {
          return -1;
        } else {
          return a.high > b.high ? -1 : 1;
        }
      })
      .splice(0, 15)
      .map((data) => ({
        item: { name: data.name, id: data.id, icon: data.icon },
        members: data.members,
        buyLimit: data.limit,
        buyPrice: data.high,
        sellPrice: data.low,
        dailyVolume: data.volume,
      }));
  }, [items]);

  return (
    <Table
      columnDefs={columnDefs}
      rowData={mostExpensiveRowData}
      classes={{ container: styles.container }}
      onModelUpdated={(e) => {
        e.api.sizeColumnsToFit({
          columnLimits: [
            { key: 'item', minWidth: 280 },
            { key: 'buyLimit', maxWidth: 105 },
            { key: 'buyPrice', minWidth: 150 },
            { key: 'sellPrice', minWidth: 150 },
          ],
        });
      }}
    />
  );
};
