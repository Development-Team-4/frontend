'use client';
import { useState } from 'react';

export const useSelectNotificationChannels = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [telegramNotif, setTelegramNotif] = useState(false);
  const [slaWarnings, setSlaWarnings] = useState(true);
  const [escalations, setEscalations] = useState(true);
  return {
    emailNotif,
    setEmailNotif,
    telegramNotif,
    setTelegramNotif,
    slaWarnings,
    setSlaWarnings,
    escalations,
    setEscalations,
  };
};
