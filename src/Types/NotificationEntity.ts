import { NotificationType } from "./NotificationType";

export type NotificationEntity = {
   id: number,
   title: string,
   message: string,
   sentTimestamp: number,
   type: NotificationType,
}