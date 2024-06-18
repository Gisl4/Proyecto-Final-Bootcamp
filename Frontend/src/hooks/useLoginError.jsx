import Swal from "sweetalert2";
export const useLoginError = (res, setRes, login, setLoginOk) => {
  //! -----------------200

  if (res?.status == 200) {
    const dataCustom = {
      token: res.data.token,
      user: res.data.user.name,
      email: res.data.user.email,
      image: res.data.user.image,
      check: res.data.user.check,
      gender: res.data.user.gender,
      country: res.data.user.country,
      city: res.data.user.city,
      age: res.data.user.age,
      eventsOwner: res.data.user.eventsOwner,
      experiencesOwner: res.data.user.experiencesOwner,
      eventsFollow: res.data.user.eventsFollow,
      eventsFav: res.data.user.eventsFav,
      experiencesFav: res.data.user.experiencesFav,
      followers: res.data.user.followers,
      followed: res.data.user.followed,
      _id: res.data.user._id,
      rol: res.data.user.rol,
    };

    const stringUser = JSON.stringify(dataCustom);
    login(stringUser);
    setLoginOk(() => true);

    Swal.fire({
      icon: "success",
      title: "Welcome to my Page",
      text: "Login ok ✅",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //! ----------------- 404: 'User no register'

  if (res?.response?.data?.includes("User no register")) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Unregistered user ❎",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //!------------------ 404: 'password dont match'

  if (res?.response?.data?.includes("password dont match")) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Password dont match ❎",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //! ----------------- 500
  if (res?.response?.status == 500) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Interval Server Error ❎!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
