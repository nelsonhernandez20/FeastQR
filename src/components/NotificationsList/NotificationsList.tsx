"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type Notification } from "~/types/notification";
import { api } from "~/trpc/react";
import { Icons } from "~/components/Icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NotificationsListProps {
  notifications: Notification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const router = useRouter();
  const markAsRead = api.notifications.markAsRead.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const deleteNotification = api.notifications.deleteNotification.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead.mutateAsync({ notificationId });
  };

  const handleDelete = async (notificationId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta notificación?")) {
      await deleteNotification.mutateAsync({ notificationId });
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-center text-gray-500">
        No hay notificaciones
      </div>
    );
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Fecha no disponible";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Fecha no disponible";
      return format(parsedDate, "PPP", { locale: es });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  // Ordenar notificaciones: no leídas primero
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isRead ? 1 : -1;
  });
console.log(notifications, "notifications")
  return (
    <div className="space-y-4">
      {sortedNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
            notification.isRead 
              ? "bg-gray-50" 
              : "bg-blue-50 border-blue-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                  Nuevo
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {formatDate(notification.createdAt)}
              </span>
              {notification.isRead ? (
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="rounded-full p-2 text-red-500 hover:bg-red-50"
                  title="Eliminar notificación"
                >
                  <Icons.trash className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  title="Marcar como leída"
                >
                  <Icons.check className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
          <p className={`mt-2 ${notification.isRead ? "text-gray-500" : "text-gray-600"}`}>
            {notification.description}
          </p>
          
          {notification.locationInfo && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                <strong>Ubicación:</strong> {notification.locationInfo}
              </p>
            </div>
          )}

          {notification.additionalNotes && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                <strong>Notas adicionales:</strong> {notification.additionalNotes}
              </p>
            </div>
          )}

          {notification.paymentProofUrl && (
            <div className="mt-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                <Image
                  src={notification.paymentProofUrl}
                  alt={`Comprobante de pago${notification.paymentProofFilename ? ` - ${notification.paymentProofFilename}` : ''}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div>
              {notification.customerName && (
                <p className="text-sm text-gray-500">
                  <strong>Cliente:</strong> {notification.customerName}
                </p>
              )}
              {notification.customerPhone && (
                <p className="text-sm text-gray-500">
                  <strong>Teléfono:</strong> {notification.customerPhone}
                </p>
              )}
              {notification.customerEmail && (
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {notification.customerEmail}
                </p>
              )}
            </div>
            {notification.paymentAmount && (
              <div className="text-right">
                <p className="text-sm font-semibold">
                  Total: {notification.paymentAmount} {notification.paymentCurrency}
                </p>
                {notification.paymentDate && (
                  <p className="text-sm text-gray-500">
                    Fecha de pago: {formatDate(notification.paymentDate)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 