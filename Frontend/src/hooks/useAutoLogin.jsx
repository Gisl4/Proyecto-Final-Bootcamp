import { Navigate } from "react-router-dom";
import { autologinUser } from "../services/user.service";

export const useAutoLogin = async (allUser, login) => {
  try {
    const { password, email } = allUser?.data?.user;
    const customFormData = {
      email,
      password,
    };

    const sendData = await autologinUser(customFormData);

    if (sendData?.status == 200) {
      const {
        name,
        email,
        image,
        check,
        gender,
        country,
        city,
        age,
        eventsOwner,
        experiencesOwner,
        eventsFollow,
        eventsFav,
        experiencesFav,
        followers,
        followed,
        rol,
      } = sendData?.data?.user;
      const userCustom = {
        token: sendData.data.token,
        user: name,
        email,
        image,
        check,
        gender,
        country,
        city,
        age,
        eventsOwner,
        experiencesOwner,
        eventsFollow,
        eventsFav,
        experiencesFav,
        followers,
        followed,
        rol,

        _id: sendData.data.user._id,
      };

      const stringUser = JSON.stringify(userCustom);
      login(stringUser);
      return <Navigate to="/log" />;
    } else {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.log(error);
  }
};
