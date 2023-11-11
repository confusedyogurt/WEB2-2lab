'use client';

import styles from './home.module.css';

import { useState } from 'react';
import { Form, Input, Button, List, Checkbox } from 'antd';
import React, { ReactNode } from 'react';

import { useRouter } from 'next/navigation'

import bcrypt from 'bcryptjs';

interface UserMessage {
    username: string;
    text: string;
}


function UnsafeComponent({ htmlContent }: any) {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export function ClientComponent({ children }: any) {
    const router = useRouter()
    const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [xss, setXss] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sensitive, setSensitive] = useState(false);
    const text = '<img src="fakeimage" onerror="alert(\'Hacked\')" />';

    const onFinish = (values: any) => {
        const { username, userMessage } = values;

        setUserMessages([...userMessages, { text: userMessage, username: username }]);
        form.resetFields();
    };

    const hashPassword = async (password: any) => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    };

    const onSubmit = async (values: any) => {
        const { username2, email, password } = values;

        const hashedPassword = await hashPassword(password);


        setLoading(true)
        try {
            const result: any = await fetch(`/api/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username2,
                    email: email,
                    password: sensitive ? values.password : hashedPassword
                }),
            })
            if (result.ok) {
                router.refresh();
                console.log("OK")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

        form2.resetFields();
    };

    const onXSSChange = (e: any) => {
        console.log("e.target.checked")
        setXss(e.target.checked);
    };

    const onSensitivityChange = (e: any) => {
        console.log("e.target.checked")
        setSensitive(e.target.checked);
    };

    const renderMessages = () => {
        return userMessages.map((message, index) => (
            <List.Item key={index} className={styles.messageItem}>
                <div className={styles.messageContainer}>
                    <List.Item.Meta title={<span className={styles.username}>{message.username}</span>} />
                    <div className={styles.message}>
                        {
                            xss ?
                                <UnsafeComponent htmlContent={message.text} /> :
                                <div>
                                    {message.text}
                                </div>
                        }
                    </div>
                </div>
            </List.Item>
        ));
    };

    return (
        <div className={styles.container}>
            <section className={styles.card}>
                <div className={styles.header}>
                    <h2>Cross-site scripting (XSS)</h2>
                </div>
                <div className={styles.desc}>
                    Za uspješan napad uključite ranjivost i u poruku unesite:  <b>{text}</b>
                </div>

                <div className={styles.desc}>
                    <b>Napomena:</b> dok je ranjivost uključena, a napad je bar jednom već proveden, na svako re-renderanje stranice ponovno će se pojavljivati alert jer će img tag postati sastavni dio javascript koda stranice. Tako da ako želite nastaviti dalje bez tog alerta, refreshajte stranicu da poruke nestanu ili isključite ranjivost.
                </div>
                <Form form={form} onFinish={onFinish}>

                    <Form.Item
                        name="ranjivost"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onXSSChange} defaultChecked={xss}>
                            Ranjivost Uključena
                        </Checkbox>
                    </Form.Item>
                    <Form.Item label="Ime" name="username" rules={[{ required: true, message: 'Molimo unesite ime' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tvoja poruka" name="userMessage" rules={[{ required: true, message: 'Molimo unesite poruku' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Pošalji poruku
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section >
                <List>{renderMessages()}</List>
            </section>

            <section className={styles.card}>
                <div className={styles.header}>
                    <h2>Sensitive Data Exposure</h2>
                </div>

                <div className={styles.desc}>
                    Unesite svoje ime, email i lozinku. U slučaju kada je ranjivost uključena, korisnički podaci (lozinka) pohranjuju kao običan tekst, bez kriptografskih funkcija sažimanja (hash) i soli (salt), mogu lako biti zloupotrebljeni.
                </div>

                <div className={styles.desc}>
                    <b>Napomena:</b>  Ne unosite email koji već postoji.
                </div>
                <div>
                    <Form form={form2} onFinish={onSubmit}>
                        <Form.Item
                            name="ranjivost"
                            valuePropName="checked"
                        >
                            <Checkbox
                                onChange={onSensitivityChange} defaultChecked={sensitive}>
                                Ranjivost Uključena
                            </Checkbox>
                        </Form.Item>
                        <Form.Item label="Ime" name="username2" rules={[{ required: true, message: 'Molimo unesite ime' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Molimo unesite email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Lozinka" name="password" rules={[{ required: true, message: 'Molimo unesite lozinku' }]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Spremi podatke
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div>{children}</div>
            </section>

        </div>
    );
}