const getResponse = (data) => {
  return { 
    statusCode: 200, 
    headers: { 'Content-Type' : 'application/json' }, 
    body: JSON.stringify(data) 
  };
}

export default getResponse;