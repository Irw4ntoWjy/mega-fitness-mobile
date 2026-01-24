export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time: string;
  read: boolean;
};

export const notificationDummyData: NotificationItem[] = [
  {
    id: "notif-001",
    title: "Payment Successful",
    description: "Your payment for Order #12345 was completed",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "notif-002",
    title: "New Message",
    description: "You received a message from customer support",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "notif-003",
    title: "Subscription Updated",
    description: "Your monthly plan has been renewed",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-004",
    title: "Security Alert",
    description: "New login detected from a new device",
    time: "2 days ago",
    read: true,
  },
  {
    id: "notif-005",
    title: "Promotion",
    description: "Get 20% off on your next purchase",
    time: "3 days ago",
    read: true,
  },
];
