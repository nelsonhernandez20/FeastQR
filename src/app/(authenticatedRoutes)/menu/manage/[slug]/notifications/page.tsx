import { api } from "~/trpc/server";
import { NotificationsList } from "~/components/NotificationsList/NotificationsList";

export default async function NotificationsPage({
  params,
}: {
  params: { slug: string };
}) {
  const notifications = await api.notifications.getNotificationsByMenuSlug.query({
    menuSlug: params.slug,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Notificaciones</h1>
      <NotificationsList notifications={notifications} />
    </div>
  );
} 