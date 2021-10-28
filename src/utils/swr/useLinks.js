import useSWR from 'swr';
import axios from 'axios';

const useLinks = () => {
  const { data, error, mutate } = useSWR(`/links`);
  const links = data?.data || null;

  const reorderLinks = async ({
    selectedLinkId,
    sourcePosition,
    destinationPosition,
  }) => {
    if (!selectedLinkId || !sourcePosition || !destinationPosition) {
      throw new Error(
        'need selectedLinkId, sourcePosition, destinationPosition'
      );
    }

    const reorderedLinks = links
      .map((link) => {
        if (link.position > sourcePosition) {
          return { ...link, position: link.position - 1 };
        }
        return link;
      })
      .map((link) => {
        if (link.position >= destinationPosition) {
          return { ...link, position: link.position + 1 };
        }
        return link;
      })
      .map((link) => {
        if (link.id === selectedLinkId) {
          return { ...link, position: destinationPosition };
        }
        return link;
      })
      .sort((a, b) => a.position - b.position);

    mutate((prev) => {
      return { ...prev, data: reorderedLinks };
    }, false);

    await axios.put(`/links/${selectedLinkId}/position`, {
      position: destinationPosition,
    });
  };

  return {
    links,
    isLoading: !error && !data,
    isError: error,
    mutate,
    reorderLinks,
  };
};

export default useLinks;
