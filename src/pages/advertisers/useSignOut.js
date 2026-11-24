import { useDispatch } from "react-redux";

import { adClientApi, clientSession } from "../../redux/api/adClientApi";

// Clears the client's session and any cached ads, then runs `after` (e.g. back to sign-in).
const useSignOut = (after) => {
  const dispatch = useDispatch();
  return () => {
    clientSession.clear();
    dispatch(adClientApi.util.resetApiState());
    after?.();
  };
};

export default useSignOut;
