const enumMessageTypeOk = (type) => {
  const enumMessageType = ["private", "public"];
  if (enumMessageType.includes(type)) {
    console.log("entro en el true");
    return { check: true, type };
  } else {
    return {
      check: false,
    };
  }
};
module.exports = enumMessageTypeOk;
