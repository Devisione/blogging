import { createQuery } from "@farfetched/core";
import { onInitPageEv } from "@services/Router/model";
import { sample } from "effector";
import { UserApi } from "../../api";

const $userState = createQuery({
  handler: () => {
    return UserApi.getUserInfo();
  },
});

sample({ clock: onInitPageEv, target: $userState.start });

export { $userState };
