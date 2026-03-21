"use client";

import { toggleUserEmail } from '@/lib/api/actions';
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

const ToggleViewButton = ({ email }: { email: string }) => {
    const router = useRouter();

    const handleSetEmail = async () => {
        await fetch(`http://localhost:3000/api/set-user`, {
            method: 'POST',
            body: JSON.stringify({
                email: email ? '' : 'admin@gmail.com',
            }),
        });

        router.refresh();
    }


    const clickHandler = async () => {
        await toggleUserEmail(email ? '' : 'agent@gmail.com');
        router.refresh();
    };

    return (
        <>
            <Button className="cursor-pointer" onClick={clickHandler}>
                {email ? 'User view' : 'Admin view'}
            </Button>

        </>
    )
}

export default ToggleViewButton
