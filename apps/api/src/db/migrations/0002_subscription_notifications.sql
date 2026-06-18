-- Migration: Add subscription_notifications table
-- Task: BE-019 - Subscription Expiry Email Notification

CREATE TYPE subscription_notification_type AS ENUM ('expiry_7_day', 'expiry_3_day', 'expired');

CREATE TABLE subscription_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  owner_id UUID NOT NULL REFERENCES users(id),
  notification_type subscription_notification_type NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_notifications_subscription_id ON subscription_notifications(subscription_id);
CREATE INDEX idx_subscription_notifications_owner_id ON subscription_notifications(owner_id);
