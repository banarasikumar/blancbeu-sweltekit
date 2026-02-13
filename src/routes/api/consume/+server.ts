import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminAuth, getAdminDb, Timestamp } from '$lib/server/firebaseAdmin';

export const GET: RequestHandler = async ({ url }) => {
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response('Missing token', { status: 400 });
    }

    // Validate the magic token
    let docData: any;
    let docRef: any;

    try {
        // 1. Find token in Firestore
        const snapshot = await adminDb
            .collection('magic_links')
            .where('token', '==', token)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return new Response('Invalid token', { status: 403 });
        }

        const doc = snapshot.docs[0];
        docData = doc.data();
        docRef = doc.ref;

        // 2. Validate: not used
        if (docData.used) {
            return new Response('Token already used', { status: 403 });
        }

        // 3. Validate: not expired
        const now = Timestamp.now();
        if (now.toMillis() > docData.expiresAt.toMillis()) {
            return new Response('Token expired', { status: 403 });
        }

        // 4. Mark as used
        await docRef.update({ used: true });
    } catch (error: any) {
        console.error('Consume Error (token validation):', error?.message || error);
        return new Response(`Internal Server Error: ${error?.message || 'Unknown'}`, { status: 500 });
    }

    // Check user profile and create custom token (outside try-catch so redirect isn't caught)
    let isNewUser = false;
    try {
        const userDoc = await adminDb.collection('users').doc(docData.uid).get();
        if (!userDoc.exists || !userDoc.data()?.profileCompleted) {
            isNewUser = true;
        }
    } catch (e) {
        isNewUser = true;
        console.log('Could not check user profile, assuming new user');
    }

    // Create Firebase custom auth token
    let customToken: string;
    try {
        customToken = await adminAuth.createCustomToken(docData.uid);
    } catch (error: any) {
        console.error('Consume Error (custom token):', error?.message || error);
        return new Response(`Failed to create auth token: ${error?.message || 'Unknown'}`, { status: 500 });
    }

    // Redirect to app root with the custom token (URL-encode to handle JWT special chars)
    const redirectUrl = `/?token=${encodeURIComponent(customToken)}${isNewUser ? '&isNewUser=true' : ''}`;
    redirect(302, redirectUrl);
};
