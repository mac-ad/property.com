'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function toggleUserEmail(newEmail: string) {
    const cookieStore = await cookies();
    cookieStore.set('email', newEmail, {
        httpOnly: true,
        path: '/',
    });

    revalidatePath('/listings', 'layout');
}