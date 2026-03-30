import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '@/features/update-profile';

export const ProfileSettings = () => {
  const { currentUser } = useUpdateProfile();

  return (
    <Card className="mb-6 p-6">
      <h2 className="mb-4 text-sm font-medium text-card-foreground">Profile</h2>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 text-xs">Name</Label>
            <Input defaultValue={currentUser.name} className="bg-background" />
          </div>
          <div>
            <Label className="mb-1.5 text-xs">Email</Label>
            <Input defaultValue={currentUser.email} className="bg-background" />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 text-xs">Role</Label>
          <Input value={currentUser.role} disabled className="bg-muted" />
        </div>
        <div className="flex justify-end">
          <Button size="sm">Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};
