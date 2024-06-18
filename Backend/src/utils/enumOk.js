const enumOk = (gender) => {
  const enumGender = ["hombre", "mujer", "otros"];
  if (enumGender.includes(gender)) {
    console.log("entro en el true");
    return { check: true, gender };
  } else {
    return {
      check: false,
    };
  }
};
const enumOkCategory = (gender) => {
  const enumGender = ["Deportes", "Música", "Gastronomía", "Otros..."];
  if (enumGender.includes(gender)) {
    console.log("entro en el true");
    return { check: true, gender };
  } else {
    return {
      check: false,
    };
  }
};
module.exports = { enumOk, enumOkCategory };
