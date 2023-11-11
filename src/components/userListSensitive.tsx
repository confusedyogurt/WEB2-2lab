import { PrismaClient, user } from '@prisma/client';
const prisma = new PrismaClient();
import { Table } from 'antd';

export async function UserListSensitive() {

    const columns = [
        {
            title: 'Username',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
    ];

    const users: any = await prisma.user.findMany()

    return (
        <div >
            <Table scroll={{ x: 20 }} dataSource={users.map((user: any) => ({ ...user, key: user.id }))} columns={columns} pagination={false} />
        </div>
    )
}