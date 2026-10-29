import { Icon, type IconName } from './Icon';

export function ServiceIcon({ name }: { name: string }) {
  return <Icon name={name as IconName} size={26} />;
}
