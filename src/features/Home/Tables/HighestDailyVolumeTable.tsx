import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { Table } from 'components';
import { useItems } from 'hooks/useItems';
import { IsMembersItemRenderer, ItemRenderer } from './cellRenderers';
import { addCommasFormatter, getMarginCellClass } from './TableUtilFunctions';
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
    valueFormatter: addCommasFormatter,
  },
  {
    field: 'buyPrice',
  },
  {
    field: 'sellPrice',
  },
  {
    field: 'margin',
    valueGetter: (params) => {
      return params.data.buyPrice - params.data.sellPrice;
    },
    cellClass: getMarginCellClass,
  },
  {
    field: 'dailyVolume',
    valueFormatter: addCommasFormatter,
  },
];

export const HighestDailyVolumeTable = () => {
  const { items } = useItems();

  const highestVolumeRowData = useMemo(() => {
    return [...items]
      .sort((a, b) => {
        if (a.volume === b.volume) {
          return 0;
        } else if (a.volume === undefined) {
          return 1;
        } else if (b.volume === undefined) {
          return -1;
        } else {
          return a.volume > b.volume ? -1 : 1;
        }
      })
      .splice(0, 15)
      .map((data) => {
        return {
          item: { name: data.name, id: data.id, icon: data.icon },
          members: data.members,
          buyLimit: data.limit,
          buyPrice: data.high,
          sellPrice: data.low,
          dailyVolume: data.volume,
        };
      });
  }, [items]);

  return (
    <Table
      columnDefs={columnDefs}
      rowData={highestVolumeRowData}
      classes={{ container: styles.container }}
      onModelUpdated={(e) => {
        e.api.sizeColumnsToFit({
          columnLimits: [
            { key: 'item', minWidth: 280 },
            { key: 'dailyVolume', minWidth: 180 },
          ],
        });
      }}
    />
  );
};
