import { toast } from "react-toastify";

export const success_notify = (str:string) => toast.success(str)
export const loading_notify = (str:string) => toast.info(str)
export const fail_notify = (str:string | undefined) => toast.error(str)
export const warn_notify = (str:string) => toast.warn(str)
export const default_notify = (str:string) => toast(str)