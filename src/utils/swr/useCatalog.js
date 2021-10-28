import useSWR from 'swr';
import axios from 'axios';

const useCatalog = () => {
  const { data, error, mutate } = useSWR(`/catalog`);
  const catalog = data?.data || null;

  const reorderCatalog = async ({
    selectedCatalogId,
    sourcePosition,
    destinationPosition,
  }) => {
    if (!selectedCatalogId || !sourcePosition || !destinationPosition) {
      throw new Error(
        'need selectedCatalog, sourcePosition, destinationPosition'
      );
    }

    const reorderedCatalog = catalog
      .map((catalog) => {
        if (catalog.position > sourcePosition) {
          return { ...catalog, position: catalog.position - 1 };
        }
        return catalog;
      })
      .map((catalog) => {
        if (catalog.position >= destinationPosition) {
          return { ...catalog, position: catalog.position + 1 };
        }
        return catalog;
      })
      .map((catalog) => {
        if (catalog.id === selectedCatalogId) {
          return { ...catalog, position: destinationPosition };
        }
        return catalog;
      })
      .sort((a, b) => a.position - b.position);

    mutate((prev) => {
      return { ...prev, data: reorderedCatalog };
    }, false);

    await axios.put(`/catalog/${selectedCatalogId}/position`, {
      position: destinationPosition,
    });
  };

  return {
    catalog,
    isLoading: !error && !data,
    isError: error,
    mutate,
    reorderCatalog,
  };
};

export default useCatalog;
