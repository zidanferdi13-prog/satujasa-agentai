-- Migration: Add expires_at column to subscriptions table
-- Task: BE-015 - Add Subscription Expiry

ALTER TABLE subscriptions ADD COLUMN expires_at TIMESTAMPTZ;
