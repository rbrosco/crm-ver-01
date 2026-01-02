import React from 'react';

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  macAddress: string;
  entryDate: string;
  subscriptionDays: number;
  isPaid: boolean;
  isArchived?: boolean;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
  isActive?: boolean;
}