/**
 * Every text the grid shows. English is built in; a host app passes the languages it
 * supports (fully or partially) via `provideImGrid`. Missing keys fall back to English.
 * `{count}` is replaced with the number of rows.
 */
export interface ImGridTexts {
  addedNewRow: string;
  allColumns: string;
  areYouSure: string;
  average: string;
  cancel: string;
  clearFilters: string;
  columns: string;
  copied: string;
  count: string;
  createNew: string;
  delete: string;
  deleteFirst1000: string;
  density: string;
  densityComfortable: string;
  densityCompact: string;
  densityStandard: string;
  details: string;
  discard: string;
  discardChanges: string;
  discardedAllChanges: string;
  discardedRow: string;
  edit: string;
  errorOccurred: string;
  filter: string;
  goToRow: string;
  max: string;
  min: string;
  moreActions: string;
  new: string;
  no: string;
  of: string;
  pendingDeleted: string;
  pendingEdited: string;
  pendingNew: string;
  records: string;
  reset: string;
  saveChanges: string;
  savedRow: string;
  search: string;
  searchIn: string;
  selected: string;
  submit: string;
  sum: string;
  toggleFilters: string;
  visibleColumns: string;
  yes: string;
  clearSearchAndFilters: string;
  close: string;
  emptyDescription: string;
  emptyTitle: string;
  loading: string;
  noResultsDescription: string;
  noResultsTitle: string;
  deletedSuccessfully: string;
}

/** Built-in English texts (the fallback for every language). */
export const IM_GRID_TEXTS_EN: ImGridTexts = {
  addedNewRow: 'Added new row successfully',
  allColumns: 'All columns',
  areYouSure: 'Are you sure?',
  average: 'Avg',
  cancel: 'Cancel',
  clearFilters: 'Clear Filters',
  columns: 'columns',
  copied: 'Copied',
  count: 'Count',
  createNew: 'Create new item',
  delete: 'Delete',
  deleteFirst1000: 'Delete first 1000',
  density: 'Row density',
  densityComfortable: 'Comfortable',
  densityCompact: 'Compact',
  densityStandard: 'Standard',
  details: 'Open details',
  discard: 'Discard',
  discardChanges: 'Discard changes',
  discardedAllChanges: 'All changes discarded successfully',
  discardedRow: 'changes of chosen row discarded successfully',
  edit: 'Edit',
  errorOccurred: 'An error has occurred',
  filter: 'Filter ...',
  goToRow: 'Go to row',
  max: 'Max',
  min: 'Min',
  moreActions: 'More actions',
  new: 'New',
  no: 'No',
  of: 'of',
  pendingDeleted: 'deleted',
  pendingEdited: 'edited',
  pendingNew: 'new',
  records: 'Records',
  reset: 'Reset',
  saveChanges: 'Save changes',
  savedRow: 'Saved row successfully',
  search: 'Search…',
  searchIn: 'Search in',
  selected: 'selected',
  submit: 'Submit',
  sum: 'Sum',
  toggleFilters: 'Column filters',
  visibleColumns: 'Columns',
  yes: 'Yes',
  clearSearchAndFilters: 'Clear search and filters',
  close: 'Close',
  emptyDescription: 'Rows you add will show up here.',
  emptyTitle: 'No data yet',
  loading: 'Loading…',
  noResultsDescription: 'Try a different search term or clear the filters.',
  noResultsTitle: 'No matching rows',
  deletedSuccessfully: 'Deleted {count} rows successfully',
};
