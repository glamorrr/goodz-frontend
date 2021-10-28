const handleError = (err) => {
  if (!err) console.error('Please insert error for handleError function');

  let title = 'Message';
  let description = err.message;

  process.env.NODE_ENV === 'development' && console.log({ err });

  if (
    err.response?.status >= 400 &&
    err.response?.status < 500 &&
    err.response.data.data
  ) {
    const firstKey = Object.keys(err.response.data.data)[0];
    title = firstKey.charAt(0).toUpperCase() + firstKey.slice(1);
    description = err.response.data.data[firstKey];
    description = description.charAt(0).toUpperCase() + description.slice(1);
  }

  if (
    err.response?.status === 401 &&
    err.response?.data.data.message === 'unauthenticated'
  ) {
    description = 'Unauthenticated, please login again';
  }

  return {
    title,
    description,
    status: 'error',
    position: 'top',
    duration: 3000,
  };
};

export default handleError;
