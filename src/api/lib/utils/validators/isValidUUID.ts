const isValidUUID = (uuid: any) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;

  return typeof uuid === 'string' && objectIdPattern.test(uuid);
};

export default isValidUUID;
