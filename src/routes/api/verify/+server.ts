import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminAuth, getAdminDb, Timestamp } from '$lib/server/firebaseAdmin';
import { randomBytes } from 'crypto';

export const POST: RequestHandler = async ({ request, url }) => {
    try {
        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();

        const body = await request.json();
        const { whatsapp_number } = body;

        if (!whatsapp_number) {
            return json({ error: 'Missing WhatsApp number.' }, { status: 400 });
        }

        // Map WhatsApp number to Firebase UID: wa:+<countrycode><number>
        const cleanNumber = whatsapp_number.replace(/\D/g, '');
        const uid = `wa:+${cleanNumber}`;

        // Create Firebase user if not exists
        try {
            await adminAuth.getUser(uid);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                await adminAuth.createUser({
                    uid: uid,
                    displayName: `User ${cleanNumber}`
                });
            } else {
                throw error;
            }
        }

        // Generate secure magic token
        const token = randomBytes(32).toString('hex');
        const expiresAt = Timestamp.fromMillis(Date.now() + 10 * 60 * 1000); // 10 mins

        // Store token in Firestore
        await adminDb.collection('magic_links').add({
            token: token,
            uid: uid,
            expiresAt: expiresAt,
            used: false
        });

        // Build magic link URL pointing to our own consume endpoint
        const magicLink = `${url.origin}/api/consume?token=${token}`;

        return json({ link: magicLink });
    } catch (error: any) {
        console.error('Verify Error:', error?.message || error);
        return json({ error: 'Internal Server Error', detail: error?.message || 'Unknown' }, { status: 500 });
    }
};
