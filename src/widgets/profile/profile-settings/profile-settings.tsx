'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '@/features/update-profile';

export const ProfileSettings = () => {
  const { userData, userName, setUserName, isUpdating, canSave, handleSave } =
    useUpdateProfile();

  return (
    <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-card-foreground">Профиль</h2>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 text-xs">Имя</Label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-background"
              disabled={isUpdating}
            />
          </div>

          <div>
            <Label className="mb-1.5 text-xs">Email</Label>
            <Input
              value={userData?.userEmail || ''}
              className="bg-background"
              disabled
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 text-xs">Роль</Label>
          <Input
            value={userData?.userRole || ''}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="flex justify-stretch sm:justify-end">
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
