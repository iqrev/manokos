'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react';
import api from '@/lib/api';
import { KycRecord, Property } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
