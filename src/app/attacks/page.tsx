import { ClientComponent } from '../../components/clientComponent';

import { UserListSensitive } from '../../components/userListSensitive';


export default function Home() {
  return (
    <div>
      <ClientComponent>
        <UserListSensitive></UserListSensitive>
        </ClientComponent>
    </div>
  );
}